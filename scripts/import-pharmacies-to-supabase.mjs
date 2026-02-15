/**
 * Import pharmacies depuis un CSV OSM (pharmacies-osm.csv ou pharmacies_point.csv)
 * vers Supabase.
 *
 * Usage: node scripts/import-pharmacies-to-supabase.mjs [fichier.csv]
 * Fichier par défaut: pharmacies-osm.csv à la racine du projet
 *
 * Nécessite: npm install proj4 csv-parse (déjà en devDependencies)
 * Variables d'environnement: .env.local (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";
import proj4 from "proj4";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Lambert 93 (RGF93) -> WGS84
proj4.defs(
  "EPSG:2154",
  "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
);

function lambert93ToWgs84(x, y) {
  const [lng, lat] = proj4("EPSG:2154", "EPSG:4326", [Number(x), Number(y)]);
  return { lat, lng };
}

function parseGeom(geomStr) {
  if (!geomStr || !geomStr.startsWith("POINT")) return null;
  const match = geomStr.match(/POINT\s*\(\s*([\d.-]+)\s+([\d.-]+)\s*\)/);
  if (!match) return null;
  try {
    return lambert93ToWgs84(match[1], match[2]);
  } catch {
    return null;
  }
}

function buildAdresse(row) {
  const num = row["addr-housenumber"]?.trim() ?? "";
  const street = row["addr-street"]?.trim() ?? "";
  const house = row["addr-housename"]?.trim() ?? "";
  const parts = [num, street, house].filter(Boolean);
  return parts.join(" ").trim() || "Adresse non renseignée";
}

function departementFromCodePostal(codePostal) {
  if (!codePostal) return "";
  const cp = String(codePostal).trim().slice(0, 2);
  return cp.length === 2 ? cp : "";
}

function normalizePhone(phone) {
  if (!phone) return null;
  const s = String(phone).replace(/\s/g, "").trim();
  return s || null;
}

async function loadEnv() {
  try {
    const envPath = resolve(root, ".env.local");
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  } catch (e) {
    console.warn(".env.local non trouvé, utilisation des variables d'environnement du shell.");
  }
}

async function main() {
  await loadEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("Définir NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local");
    process.exit(1);
  }

  const csvPath = resolve(root, process.argv[2] || "pharmacies-osm.csv");
  let csvContent;
  try {
    csvContent = readFileSync(csvPath, "utf8");
  } catch (e) {
    console.error("Fichier CSV introuvable:", csvPath);
    console.error("Usage: node scripts/import-pharmacies-to-supabase.mjs [pharmacies-osm.csv]");
    process.exit(1);
  }

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });

  const BATCH = 200;
  const rows = [];
  for (const row of records) {
    const name = row.name?.trim() || row["short_name"]?.trim() || "Pharmacie";
    const codePostal = row["addr-postcode"]?.trim() ?? "";
    const ville = row["addr-city"]?.trim() ?? "";
    const geom = parseGeom(row.the_geom);

    rows.push({
      id: String(row.osm_id || row.FID || `${name}-${codePostal}-${ville}`).replace(/\s/g, "-"),
      nom: name,
      adresse: buildAdresse(row),
      code_postal: codePostal,
      ville: ville,
      departement: departementFromCodePostal(codePostal),
      telephone: normalizePhone(row.phone || row["contact-phone"]),
      latitude: geom?.lat ?? null,
      longitude: geom?.lng ?? null,
      horaires: row.opening_hours?.trim() || null,
    });
  }

  const supabase = createClient(url, key);
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const { data, error } = await supabase.from("pharmacies").upsert(chunk, {
      onConflict: "id",
    });
    if (error) {
      console.error("Erreur batch", i / BATCH + 1, error.message);
      errors += chunk.length;
    } else {
      inserted += chunk.length;
      console.log(`Importé ${Math.min(i + BATCH, rows.length)} / ${rows.length}`);
    }
  }

  console.log("\nTerminé:", inserted, "lignes importées.", errors ? `${errors} erreurs.` : "");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
