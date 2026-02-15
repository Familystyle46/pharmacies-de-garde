import { supabase } from "./supabase";

export interface Pharmacie {
  id: string;
  nom: string;
  adresse: string;
  code_postal: string;
  ville: string;
  departement: string;
  telephone?: string;
  latitude?: number;
  longitude?: number;
  horaires?: string;
}

export interface Ville {
  slug: string;
  nom: string;
  departement: string;
  count: number;
}

/** Slug sans accents, aligné avec getVillesByDepartement et SearchBar */
function toVilleSlug(ville: string): string {
  return ville
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Slug pour une pharmacie (nom → URL) */
function toPharmacieSlug(nom: string): string {
  return String(nom || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    || "pharmacie";
}

/** Retourne le slug URL d'une pharmacie à partir de son nom (export pour pages/cards). */
export function getPharmacieSlug(nom: string): string {
  return toPharmacieSlug(nom);
}

export async function getVilles(): Promise<Ville[]> {
  const { data, error } = await supabase
    .from("pharmacies")
    .select("ville, departement, code_postal")
    .not("ville", "is", null);

  if (error) return [];

  const byVille = new Map<string, { nom: string; departement: string; count: number }>();
  for (const row of data ?? []) {
    const ville = String(row.ville || "").trim();
    if (!ville) continue;
    const key = toVilleSlug(ville);
    if (!key || key === "-") continue;
    const existing = byVille.get(key);
    if (existing) existing.count++;
    else byVille.set(key, { nom: ville, departement: (row.departement as string) || "", count: 1 });
  }
  return Array.from(byVille.entries())
    .filter(([slug]) => slug && slug.length > 0)
    .map(([slug, v]) => ({ slug, nom: v.nom, departement: v.departement, count: v.count }));
}

export async function getPharmaciesByVille(villeSlug: string): Promise<Pharmacie[]> {
  const info = await getVilleBySlug(villeSlug);
  const villeNom = info?.nom ?? villeSlug.replace(/-/g, " ");
  const { data, error } = await supabase
    .from("pharmacies")
    .select("*")
    .eq("ville", villeNom);

  if (error) return [];
  return (data ?? []) as Pharmacie[];
}

export async function getPharmaciesByVilleEtDepartement(villeSlug: string, departementSlug: string): Promise<Pharmacie[]> {
  const info = await getVilleBySlug(villeSlug);
  const villeNom = info?.nom ?? villeSlug.replace(/-/g, " ");
  const dep = departementSlug.replace(/-/g, " ");
  const { data, error } = await supabase
    .from("pharmacies")
    .select("*")
    .eq("ville", villeNom)
    .or(`departement.eq.${dep},code_postal.like.${dep}%`);

  if (error) return [];
  return (data ?? []) as Pharmacie[];
}

export async function getDepartementsByVille(villeSlug: string): Promise<{ slug: string; nom: string; count: number }[]> {
  const info = await getVilleBySlug(villeSlug);
  const villeNom = info?.nom ?? villeSlug.replace(/-/g, " ");
  const { data, error } = await supabase
    .from("pharmacies")
    .select("departement, code_postal")
    .eq("ville", villeNom);

  if (error) return [];

  const byDep = new Map<string, number>();
  for (const row of data ?? []) {
    const dep = (row.departement as string) || (row.code_postal as string)?.slice(0, 2) || "inconnu";
    const slug = String(dep).toLowerCase().replace(/\s+/g, "-");
    byDep.set(slug, (byDep.get(slug) ?? 0) + 1);
  }
  return Array.from(byDep.entries()).map(([slug, count]) => ({
    slug,
    nom: slug.replace(/-/g, " "),
    count,
  }));
}

export async function getVilleBySlug(villeSlug: string): Promise<{ nom: string; departement: string } | null> {
  const villes = await getVilles();
  return villes.find((v) => v.slug === villeSlug) ?? null;
}

export async function getAllVillesSlugs(): Promise<string[]> {
  const villes = await getVilles();
  return villes.map((v) => v.slug);
}

export interface VilleSuggestion {
  ville: string;
  ville_slug: string;
  departement: string;
  code_postal: string;
}

export async function getVillesSuggestions(query: string): Promise<VilleSuggestion[]> {
  const q = String(query || "").trim();
  if (q.length < 2) return [];

  const { data, error } = await supabase
    .from("pharmacies")
    .select("ville, departement, code_postal")
    .ilike("ville", `%${q}%`)
    .order("ville", { ascending: true })
    .limit(20);

  if (error) return [];

  const seen = new Set<string>();
  const results: VilleSuggestion[] = [];
  for (const row of data ?? []) {
    const ville = String(row.ville || "").trim();
    if (!ville) continue;
    const slug = toVilleSlug(ville);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    results.push({
      ville,
      ville_slug: slug,
      departement: (row.departement as string) || (row.code_postal as string)?.slice(0, 2) || "",
      code_postal: (row.code_postal as string) || "",
    });
    if (results.length >= 8) break;
  }
  return results;
}

export interface VilleProche {
  ville: string;
  ville_slug: string;
}

export async function getVillesProches(
  departement: string,
  currentSlug: string
): Promise<VilleProche[]> {
  const dept = String(departement || "").trim().replace(/\s+/g, "-");
  if (!dept) return [];

  const depNum = dept.replace(/-/g, "");
  const { data, error } = await supabase
    .from("pharmacies")
    .select("ville, code_postal, departement")
    .or(`departement.eq.${depNum},code_postal.ilike.${depNum}%`);

  if (error) return [];

  const seen = new Map<string, string>();
  for (const row of data ?? []) {
    const ville = String(row.ville || "").trim();
    if (!ville) continue;
    const slug = toVilleSlug(ville);
    if (!slug || slug === currentSlug || seen.has(slug)) continue;
    seen.set(slug, ville);
  }
  return Array.from(seen.entries())
    .slice(0, 6)
    .map(([ville_slug, ville]) => ({ ville, ville_slug }));
}

export async function getVillesForSitemap(): Promise<{ slug: string }[]> {
  const slugs = await getAllVillesSlugs();
  return slugs
    .filter((s) => s && s.trim().length > 0 && !s.includes("/"))
    .map((slug) => ({ slug }));
}

export interface VilleParDepartement {
  ville: string;
  ville_slug: string;
  nb_pharmacies: number;
}

export async function getVillesByDepartement(
  deptCode: string
): Promise<VilleParDepartement[]> {
  const dept = String(deptCode || "").trim().replace(/\s+/g, "");
  if (!dept) return [];

  const { data, error } = await supabase
    .from("pharmacies")
    .select("ville, code_postal, departement")
    .or(`code_postal.ilike.${dept}*,departement.eq.${dept}`);

  if (error) return [];

  const byVille = new Map<string, { ville: string; count: number }>();
  for (const row of data ?? []) {
    const ville = String(row.ville || "").trim();
    if (!ville) continue;
    const cp = String(row.code_postal || "").trim();
    if (!cp.startsWith(dept) && String(row.departement || "").trim() !== dept) continue;
    const slug = toVilleSlug(ville);
    if (!slug) continue;
    const existing = byVille.get(slug);
    if (existing) existing.count++;
    else byVille.set(slug, { ville, count: 1 });
  }
  return Array.from(byVille.entries())
    .map(([ville_slug, v]) => ({
      ville: v.ville,
      ville_slug,
      nb_pharmacies: v.count,
    }))
    .sort((a, b) => b.nb_pharmacies - a.nb_pharmacies);
}

export async function getTopDepartementsCodes(): Promise<string[]> {
  const { data, error } = await supabase
    .from("pharmacies")
    .select("code_postal, departement");

  if (error) return [];

  const byDept = new Map<string, number>();
  for (const row of data ?? []) {
    const dep = (row.departement as string)?.trim() || (row.code_postal as string)?.slice(0, 2) || "";
    if (dep && dep.length >= 2) {
      const code = dep.length === 1 ? `0${dep}` : dep.slice(0, 2);
      byDept.set(code, (byDept.get(code) ?? 0) + 1);
    }
  }
  return Array.from(byDept.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([code]) => code);
}

/** Une pharmacie par slug ville + slug pharmacie (nom slugifié). */
export async function getPharmacieBySlug(
  villeSlug: string,
  pharmacieSlug: string
): Promise<Pharmacie | null> {
  const info = await getVilleBySlug(villeSlug);
  const villeNom = info?.nom ?? villeSlug.replace(/-/g, " ");
  const pharmacies = await getPharmaciesByVille(villeSlug);
  const found = pharmacies.find((p) => toPharmacieSlug(p.nom) === pharmacieSlug) ?? null;
  return found;
}

export interface PharmacieSlugPair {
  ville_slug: string;
  pharmacie_slug: string;
}

/** Paires (ville_slug, pharmacie_slug) pour generateStaticParams, limit 1000. */
export async function getAllPharmaciesSlugs(): Promise<PharmacieSlugPair[]> {
  const { data, error } = await supabase
    .from("pharmacies")
    .select("ville, nom")
    .not("ville", "is", null)
    .not("nom", "is", null)
    .limit(2000);

  if (error) return [];

  const seen = new Set<string>();
  const pairs: PharmacieSlugPair[] = [];
  for (const row of data ?? []) {
    const ville = String(row.ville || "").trim();
    const nom = String(row.nom || "").trim();
    if (!ville || !nom) continue;
    const vSlug = toVilleSlug(ville);
    const pSlug = toPharmacieSlug(nom);
    if (!vSlug || !pSlug) continue;
    const key = `${vSlug}|${pSlug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    pairs.push({ ville_slug: vSlug, pharmacie_slug: pSlug });
    if (pairs.length >= 1000) break;
  }
  return pairs;
}
