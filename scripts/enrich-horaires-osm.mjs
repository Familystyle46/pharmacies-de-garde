/**
 * Enrichissement des horaires (et téléphones manquants) depuis OpenStreetMap.
 *
 * Met à jour UNIQUEMENT :
 *   - horaires  (si null/vide dans notre BDD)
 *   - telephone (si null/vide dans notre BDD)
 *
 * Matching par proximité GPS : on cherche la pharmacie OSM la plus proche
 * dans un rayon de 80m. En dessous de ce seuil on considère que c'est la même.
 *
 * Source : Overpass API (OSM) — gratuit, pas de clé requise.
 *
 * Usage : node scripts/enrich-horaires-osm.mjs [--dry-run]
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const DRY_RUN = process.argv.includes("--dry-run");

// Rayon de matching en mètres
const MATCH_RADIUS_M = 80;

// ─── Chargement .env.local ──────────────────────────────────────────────────
async function loadEnv() {
  try {
    const content = readFileSync(resolve(root, ".env.local"), "utf8");
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  } catch {
    console.warn(".env.local non trouvé.");
  }
}

// ─── Distance Haversine en mètres ──────────────────────────────────────────
function haversineM(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Récupération OSM via Overpass ─────────────────────────────────────────
async function fetchOsmPharmacies() {
  // Bounding box France métropolitaine + Corse
  const query = `
[out:json][timeout:180];
(
  node["amenity"="pharmacy"]["opening_hours"](41,-6,52,11);
  way["amenity"="pharmacy"]["opening_hours"](41,-6,52,11);
);
out center;
  `.trim();

  console.log("Téléchargement des données OSM (Overpass API)...");
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!res.ok) throw new Error(`Overpass erreur ${res.status}`);

  const json = await res.json();
  const elements = json.elements ?? [];

  // Normalise nodes et ways (ways ont center.lat/center.lon)
  const pharmacies = [];
  for (const el of elements) {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (!lat || !lon) continue;
    const tags = el.tags ?? {};
    const horaires = tags.opening_hours?.trim() || null;
    if (!horaires) continue;
    const phone =
      (tags.phone || tags["contact:phone"] || tags.fax)?.trim() || null;
    pharmacies.push({ lat, lon, horaires, phone });
  }
  return pharmacies;
}

// ─── Récupération paginée depuis Supabase ───────────────────────────────────
async function fetchPharmaciesIncompletes(supabase) {
  const PAGE = 1000;
  let from = 0;
  const all = [];

  while (true) {
    const { data, error } = await supabase
      .from("pharmacies")
      .select("id, latitude, longitude, horaires, telephone")
      .or("horaires.is.null,horaires.eq.")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .range(from, from + PAGE - 1);

    if (error) throw new Error("Erreur Supabase: " + error.message);
    if (!data || data.length === 0) break;
    all.push(...data);
    process.stdout.write(`\r  Récupéré : ${all.length} pharmacies sans horaires...`);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  console.log("");
  return all;
}

// ─── Construction d'un index spatial simple (grille par degré) ─────────────
function buildSpatialIndex(osmPharmacies) {
  const grid = new Map();
  for (const p of osmPharmacies) {
    // Clé = degré entier de lat/lon (cellule ~111km × ~111km)
    // On indexe aussi les cellules adjacentes pour les cas limites
    const key = `${Math.floor(p.lat)},${Math.floor(p.lon)}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push(p);
  }
  return grid;
}

function findClosest(lat, lon, grid, maxDist) {
  const latCell = Math.floor(lat);
  const lonCell = Math.floor(lon);
  let best = null;
  let bestDist = maxDist;

  // Chercher dans la cellule et les 8 cellules adjacentes
  for (let dlat = -1; dlat <= 1; dlat++) {
    for (let dlon = -1; dlon <= 1; dlon++) {
      const key = `${latCell + dlat},${lonCell + dlon}`;
      const candidates = grid.get(key) ?? [];
      for (const c of candidates) {
        const d = haversineM(lat, lon, c.lat, c.lon);
        if (d < bestDist) {
          bestDist = d;
          best = c;
        }
      }
    }
  }
  return best;
}

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  await loadEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Définir NEXT_PUBLIC_SUPABASE_URL dans .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  // 1. Charger les données OSM
  let osmPharmacies;
  try {
    osmPharmacies = await fetchOsmPharmacies();
  } catch (e) {
    console.error("Erreur Overpass:", e.message);
    process.exit(1);
  }
  console.log(`${osmPharmacies.length} pharmacies OSM avec horaires trouvées.`);

  // 2. Construire l'index spatial
  const grid = buildSpatialIndex(osmPharmacies);

  // 3. Charger les pharmacies sans horaires depuis notre BDD
  console.log("\nRécupération des pharmacies sans horaires...");
  const pharmacies = await fetchPharmaciesIncompletes(supabase);
  console.log(`${pharmacies.length} pharmacies à enrichir.`);

  if (DRY_RUN) console.log("Mode DRY-RUN — aucune écriture en base.");

  // 4. Matching et préparation des mises à jour
  const updates = [];
  let matched = 0;
  let noMatch = 0;

  for (const row of pharmacies) {
    const closest = findClosest(
      row.latitude,
      row.longitude,
      grid,
      MATCH_RADIUS_M
    );
    if (!closest) {
      noMatch++;
      continue;
    }

    const update = { id: row.id };
    let hasChange = false;

    if (closest.horaires && (!row.horaires || row.horaires === "")) {
      update.horaires = closest.horaires;
      hasChange = true;
    }
    // Enrichit aussi le téléphone si manquant
    if (closest.phone && (!row.telephone || row.telephone === "")) {
      update.telephone = closest.phone;
      hasChange = true;
    }

    if (hasChange) {
      updates.push(update);
      matched++;
    } else {
      noMatch++;
    }
  }

  console.log(`\n${matched} matchés (rayon ${MATCH_RADIUS_M}m), ${noMatch} sans correspondance.`);

  if (DRY_RUN) {
    console.log("\nExemples :");
    for (const u of updates.slice(0, 10)) {
      console.log(`  id=${u.id} → horaires="${u.horaires}" | tel="${u.telephone ?? "-"}"`);
    }
    console.log(`\nTotal qui seraient mis à jour : ${updates.length}`);
    return;
  }

  // 5. Upsert en base
  const DB_BATCH = 200;
  let totalUpdated = 0;
  let totalErrors = 0;

  for (let i = 0; i < updates.length; i += DB_BATCH) {
    const chunk = updates.slice(i, i + DB_BATCH);
    const { error } = await supabase
      .from("pharmacies")
      .upsert(chunk, { onConflict: "id" });

    if (error) {
      console.error(`Erreur upsert batch ${i / DB_BATCH + 1}:`, error.message);
      totalErrors += chunk.length;
    } else {
      totalUpdated += chunk.length;
      process.stdout.write(
        `\r  Enregistré : ${Math.min(i + DB_BATCH, updates.length)} / ${updates.length}`
      );
    }
  }
  console.log("");

  console.log("\n─────────────────────────────────────────");
  console.log("Terminé :");
  console.log(`  Mis à jour : ${totalUpdated}`);
  console.log(`  Sans match : ${noMatch}`);
  console.log(`  Erreurs    : ${totalErrors}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
