/**
 * Reverse geocoding des pharmacies sans adresse complète.
 *
 * Met à jour UNIQUEMENT : ville, ville_slug, code_postal, departement
 * Ne touche PAS : id, nom, adresse, telephone, horaires, latitude, longitude,
 *                 pharmacie_slug, osm_id, created_at
 *
 * Source : api-adresse.data.gouv.fr (API officielle, endpoint batch CSV)
 * Endpoint : POST https://api-adresse.data.gouv.fr/reverse/csv/
 *
 * Usage : node scripts/reverse-geocode-missing-addresses.mjs [--dry-run]
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const DRY_RUN = process.argv.includes("--dry-run");

// ─── Slugification identique à lib/pharmacies.ts ───────────────────────────
function toVilleSlug(ville) {
  return String(ville || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ─── Extraction département depuis code postal ──────────────────────────────
function deptFromCodePostal(cp) {
  if (!cp) return "";
  const s = String(cp).trim().replace(/\s/g, "");
  if (s.length < 2) return "";
  // DOM-TOM : 971xx–976xx → 3 premiers chiffres
  if (s.startsWith("97") && s.length >= 3) return s.slice(0, 3);
  // France métropolitaine : 2 premiers chiffres
  return s.slice(0, 2);
}

// ─── Parsing CSV simple gérant les guillemets ───────────────────────────────
function parseCSVLine(line) {
  const cols = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      cols.push(current);
      current = "";
    } else {
      current += c;
    }
  }
  cols.push(current);
  return cols;
}

// ─── Chargement .env.local ──────────────────────────────────────────────────
async function loadEnv() {
  try {
    const content = readFileSync(resolve(root, ".env.local"), "utf8");
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  } catch {
    console.warn(".env.local non trouvé, utilisation des variables du shell.");
  }
}

// ─── Appel API batch reverse geocoding ─────────────────────────────────────
async function reverseBatch(rows) {
  const lines = ["id,longitude,latitude"];
  for (const row of rows) {
    lines.push(`${row.id},${row.longitude},${row.latitude}`);
  }

  const formData = new FormData();
  formData.append(
    "data",
    new Blob([lines.join("\n")], { type: "text/csv" }),
    "pharmacies.csv"
  );

  const res = await fetch("https://api-adresse.data.gouv.fr/reverse/csv/", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`API adresse erreur ${res.status}: ${await res.text()}`);
  }

  const text = await res.text();
  const resultLines = text.trim().split("\n");
  const headers = parseCSVLine(resultLines[0]);
  const idx = (name) => headers.indexOf(name);

  const idIdx = idx("id");
  const postcodeIdx = idx("result_postcode");
  const cityIdx = idx("result_city");
  const statusIdx = idx("result_status");

  const results = new Map();
  for (let i = 1; i < resultLines.length; i++) {
    const cols = parseCSVLine(resultLines[i]);
    const id = cols[idIdx]?.trim();
    const postcode = cols[postcodeIdx]?.trim() ?? "";
    const city = cols[cityIdx]?.trim() ?? "";
    const status = cols[statusIdx]?.trim() ?? "";

    // On accepte uniquement les résultats trouvés ("ok")
    if (id && status === "ok" && city) {
      results.set(id, { postcode, city });
    }
  }
  return results;
}

// ─── Récupération paginée depuis Supabase ───────────────────────────────────
async function fetchAllIncomplete(supabase) {
  const PAGE = 1000;
  let from = 0;
  const all = [];

  while (true) {
    const { data, error } = await supabase
      .from("pharmacies")
      .select("id, latitude, longitude, ville, ville_slug, code_postal, departement")
      .or("code_postal.eq.,code_postal.is.null")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .range(from, from + PAGE - 1);

    if (error) throw new Error("Erreur lecture Supabase: " + error.message);
    if (!data || data.length === 0) break;

    all.push(...data);
    process.stdout.write(`\r  Récupéré : ${all.length} pharmacies...`);

    if (data.length < PAGE) break;
    from += PAGE;
  }
  console.log("");
  return all;
}

// ─── Main ───────────────────────────────────────────────────────────────────
async function main() {
  await loadEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error(
      "Définir NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local"
    );
    process.exit(1);
  }

  const supabase = createClient(url, key);

  console.log("Récupération des pharmacies sans code postal...");
  const pharmacies = await fetchAllIncomplete(supabase);
  console.log(`${pharmacies.length} pharmacies à enrichir.`);

  if (DRY_RUN) console.log("Mode DRY-RUN activé — aucune écriture en base.");

  const API_BATCH = 5000;  // taille des appels à l'API
  const DB_BATCH = 200;    // taille des upserts Supabase
  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (let i = 0; i < pharmacies.length; i += API_BATCH) {
    const chunk = pharmacies.slice(i, i + API_BATCH);
    const batchNum = Math.floor(i / API_BATCH) + 1;
    const totalBatches = Math.ceil(pharmacies.length / API_BATCH);
    console.log(
      `\nBatch géocodage ${batchNum}/${totalBatches} (${chunk.length} pharmacies)...`
    );

    let geocoded;
    try {
      geocoded = await reverseBatch(chunk);
    } catch (e) {
      console.error("  Erreur API reverse batch:", e.message);
      totalErrors += chunk.length;
      continue;
    }

    console.log(`  → ${geocoded.size} résultats valides (status=ok)`);

    // Prépare les mises à jour
    const updates = [];
    for (const row of chunk) {
      const result = geocoded.get(String(row.id));
      if (!result) {
        totalSkipped++;
        continue;
      }

      const { postcode, city } = result;
      const dept = deptFromCodePostal(postcode);
      const villeSlug = toVilleSlug(city);

      // Ignore si strictement identique à ce qu'on a déjà
      if (
        row.code_postal === postcode &&
        row.ville === city &&
        row.departement === dept
      ) {
        totalSkipped++;
        continue;
      }

      // Ignore si le slug généré est vide (ville invalide)
      if (!villeSlug) {
        totalSkipped++;
        continue;
      }

      updates.push({
        id: row.id,
        ville: city,
        ville_slug: villeSlug,
        code_postal: postcode,
        departement: dept,
      });
    }

    console.log(`  → ${updates.length} mises à jour préparées`);

    if (DRY_RUN) {
      if (updates.length > 0) {
        console.log("  Exemples :");
        for (const u of updates.slice(0, 8)) {
          console.log(
            `    id=${u.id} → ville="${u.ville}" | cp="${u.code_postal}" | dept="${u.departement}" | slug="${u.ville_slug}"`
          );
        }
      }
      totalUpdated += updates.length;
      continue;
    }

    // Enregistrement en sous-batches
    for (let j = 0; j < updates.length; j += DB_BATCH) {
      const subChunk = updates.slice(j, j + DB_BATCH);
      const { error: upsertError } = await supabase
        .from("pharmacies")
        .upsert(subChunk, { onConflict: "id" });

      if (upsertError) {
        console.error(
          `  Erreur upsert batch ${j / DB_BATCH + 1}:`,
          upsertError.message
        );
        totalErrors += subChunk.length;
      } else {
        totalUpdated += subChunk.length;
        process.stdout.write(
          `\r  Enregistré : ${Math.min(j + DB_BATCH, updates.length)} / ${updates.length}`
        );
      }
    }
    console.log("");
  }

  console.log("\n─────────────────────────────────────────");
  console.log(`Terminé${DRY_RUN ? " (DRY-RUN)" : ""} :`);
  console.log(`  Mis à jour : ${totalUpdated}`);
  console.log(`  Ignorés    : ${totalSkipped} (score faible ou données déjà correctes)`);
  console.log(`  Erreurs    : ${totalErrors}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
