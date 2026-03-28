/**
 * Enrichissement des horaires et téléphones via Google Places API (New).
 *
 * Met à jour UNIQUEMENT :
 *   - horaires  (si null/vide dans notre BDD)
 *   - telephone (si null/vide dans notre BDD)
 *
 * Stratégie : Nearby Search autour de chaque pharmacie (rayon 80m),
 * on prend le résultat le plus proche et on extrait les horaires.
 *
 * Field mask minimal pour réduire le coût :
 *   - places.regularOpeningHours  → Atmosphere SKU ($0.005/req)
 *   - places.internationalPhoneNumber → Contact SKU (+$0.003/req)
 *   - places.location + places.displayName → Basic (inclus)
 * Coût estimé : ~$0.008/pharmacie → ~$75 pour 9 420 fiches
 *
 * Usage :
 *   GOOGLE_PLACES_API_KEY=xxx node scripts/enrich-horaires-google.mjs --dry-run
 *   GOOGLE_PLACES_API_KEY=xxx node scripts/enrich-horaires-google.mjs
 *   GOOGLE_PLACES_API_KEY=xxx node scripts/enrich-horaires-google.mjs --limit=100
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const DRY_RUN = process.argv.includes("--dry-run");
const LIMIT_ARG = process.argv.find((a) => a.startsWith("--limit="));
const LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.split("=")[1]) : Infinity;

const MATCH_RADIUS_M = 80;
const SEARCH_RADIUS_M = 80;
// Pause entre requêtes pour éviter le rate limiting (10 req/s max)
const DELAY_MS = 120;

// ─── Chargement .env.local ──────────────────────────────────────────────────
async function loadEnv() {
  try {
    const content = readFileSync(resolve(root, ".env.local"), "utf8");
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  } catch {
    /* ignore */
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

// ─── Appel Google Places API Nearby Search ─────────────────────────────────
async function searchNearby(apiKey, lat, lon) {
  const body = {
    includedTypes: ["pharmacy"],
    maxResultCount: 5,
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lon },
        radius: SEARCH_RADIUS_M,
      },
    },
  };

  const res = await fetch(
    "https://places.googleapis.com/v1/places:searchNearby",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        // Field mask : Basic (gratuit) + Atmosphere ($0.005) + Contact ($0.003)
        "X-Goog-FieldMask":
          "places.location,places.displayName,places.regularOpeningHours,places.internationalPhoneNumber",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Places API ${res.status}: ${err}`);
  }

  const json = await res.json();
  return json.places ?? [];
}

// ─── Conversion horaires Google → format OSM-like ─────────────────────────
function formatHoraires(regularOpeningHours) {
  if (!regularOpeningHours?.weekdayDescriptions) return null;
  // Retourne la description brute de Google (lisible)
  return regularOpeningHours.weekdayDescriptions.join(" | ");
}

// ─── Récupération paginée depuis Supabase ───────────────────────────────────
async function fetchPharmaciesIncompletes(supabase) {
  const PAGE = 1000;
  let from = 0;
  const all = [];

  while (true) {
    const { data, error } = await supabase
      .from("pharmacies")
      .select("id, nom, latitude, longitude, horaires, telephone")
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

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  await loadEnv();

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error(
      "Définir GOOGLE_PLACES_API_KEY dans .env.local ou en variable d'environnement"
    );
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Définir NEXT_PUBLIC_SUPABASE_URL dans .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  console.log("Récupération des pharmacies sans horaires...");
  let pharmacies = await fetchPharmaciesIncompletes(supabase);

  if (LIMIT < pharmacies.length) {
    console.log(`Limité à ${LIMIT} pharmacies (--limit=${LIMIT})`);
    pharmacies = pharmacies.slice(0, LIMIT);
  }

  console.log(`${pharmacies.length} pharmacies à traiter.`);
  const estimatedCost = (pharmacies.length * 0.008).toFixed(2);
  console.log(`Coût estimé : ~$${estimatedCost} (Atmosphere $0.005 + Contact $0.003 par req)`);

  if (DRY_RUN) {
    console.log("\nMode DRY-RUN — test sur les 5 premières pharmacies...\n");
    pharmacies = pharmacies.slice(0, 5);
  }

  const DB_BATCH = 200;
  const updates = [];
  let matched = 0;
  let noMatch = 0;
  let apiErrors = 0;

  for (let i = 0; i < pharmacies.length; i++) {
    const row = pharmacies[i];
    process.stdout.write(
      `\r  Traitement : ${i + 1}/${pharmacies.length} | Matchés: ${matched} | Sans résultat: ${noMatch} | Erreurs: ${apiErrors}`
    );

    let places;
    try {
      places = await searchNearby(apiKey, row.latitude, row.longitude);
    } catch (e) {
      apiErrors++;
      // Rate limit → on attend plus longtemps
      if (e.message.includes("429")) await new Promise((r) => setTimeout(r, 2000));
      continue;
    }

    // Trouver le résultat le plus proche dans le rayon
    let best = null;
    let bestDist = MATCH_RADIUS_M;
    for (const place of places) {
      const plat = place.location?.latitude;
      const plon = place.location?.longitude;
      if (!plat || !plon) continue;
      const d = haversineM(row.latitude, row.longitude, plat, plon);
      if (d < bestDist) {
        bestDist = d;
        best = place;
      }
    }

    if (!best) {
      noMatch++;
    } else {
      const horaires = formatHoraires(best.regularOpeningHours);
      const telephone = best.internationalPhoneNumber?.trim() || null;

      const update = { id: row.id };
      let hasChange = false;

      if (horaires && (!row.horaires || row.horaires === "")) {
        update.horaires = horaires;
        hasChange = true;
      }
      if (telephone && (!row.telephone || row.telephone === "")) {
        update.telephone = telephone;
        hasChange = true;
      }

      if (hasChange) {
        matched++;
        updates.push(update);

        if (DRY_RUN) {
          console.log(`\n  ✓ ${row.nom} (${row.latitude},${row.longitude})`);
          console.log(`    → horaires: "${horaires}"`);
          console.log(`    → tel: "${telephone ?? "-"}"`);
        }
      } else {
        noMatch++;
      }
    }

    // Flush en base tous les DB_BATCH enregistrements
    if (!DRY_RUN && updates.length >= DB_BATCH) {
      const chunk = updates.splice(0, DB_BATCH);
      const { error } = await supabase
        .from("pharmacies")
        .upsert(chunk, { onConflict: "id" });
      if (error) console.error("\nErreur upsert:", error.message);
    }

    // Pause pour respecter le rate limit Google
    if (!DRY_RUN) await new Promise((r) => setTimeout(r, DELAY_MS));
  }

  // Flush le reste
  if (!DRY_RUN && updates.length > 0) {
    for (let j = 0; j < updates.length; j += DB_BATCH) {
      const chunk = updates.slice(j, j + DB_BATCH);
      const { error } = await supabase
        .from("pharmacies")
        .upsert(chunk, { onConflict: "id" });
      if (error) console.error("\nErreur upsert:", error.message);
    }
  }

  console.log("\n\n─────────────────────────────────────────");
  console.log(`Terminé${DRY_RUN ? " (DRY-RUN)" : ""} :`);
  console.log(`  Mis à jour  : ${matched}`);
  console.log(`  Sans résultat : ${noMatch}`);
  console.log(`  Erreurs API : ${apiErrors}`);
  if (!DRY_RUN) {
    const realCost = (pharmacies.length * 0.008).toFixed(2);
    console.log(`  Coût réel estimé : ~$${realCost}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
