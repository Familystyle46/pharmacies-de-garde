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

export async function getVilles(): Promise<Ville[]> {
  const { data, error } = await supabase
    .from("pharmacies")
    .select("ville, departement, code_postal")
    .not("ville", "is", null);

  if (error) return [];

  const byVille = new Map<string, { nom: string; departement: string; count: number }>();
  for (const row of data ?? []) {
    const key = (row.ville as string).toLowerCase().replace(/\s+/g, "-");
    const existing = byVille.get(key);
    if (existing) existing.count++;
    else byVille.set(key, { nom: row.ville as string, departement: row.departement as string, count: 1 });
  }
  return Array.from(byVille.entries()).map(([slug, v]) => ({ slug, nom: v.nom, departement: v.departement, count: v.count }));
}

export async function getPharmaciesByVille(villeSlug: string): Promise<Pharmacie[]> {
  const villeNom = villeSlug.replace(/-/g, " ");
  const { data, error } = await supabase
    .from("pharmacies")
    .select("*")
    .ilike("ville", villeNom);

  if (error) return [];
  return (data ?? []) as Pharmacie[];
}

export async function getPharmaciesByVilleEtDepartement(villeSlug: string, departementSlug: string): Promise<Pharmacie[]> {
  const villeNom = villeSlug.replace(/-/g, " ");
  const dep = departementSlug.replace(/-/g, " ");
  const { data, error } = await supabase
    .from("pharmacies")
    .select("*")
    .ilike("ville", villeNom)
    .or(`departement.eq.${dep},code_postal.like.${dep}%`);

  if (error) return [];
  return (data ?? []) as Pharmacie[];
}

export async function getDepartementsByVille(villeSlug: string): Promise<{ slug: string; nom: string; count: number }[]> {
  const villeNom = villeSlug.replace(/-/g, " ");
  const { data, error } = await supabase
    .from("pharmacies")
    .select("departement, code_postal")
    .ilike("ville", villeNom);

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
