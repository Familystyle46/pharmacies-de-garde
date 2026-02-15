import type { Metadata } from "next";
import Link from "next/link";
import {
  getPharmaciesByVilleEtDepartement,
  getVilleBySlug,
} from "@/lib/pharmacies";
import { PharmacieCard } from "@/components/PharmacieCard";
import { MapView } from "@/components/MapView";

interface PageProps {
  params: Promise<{ ville: string; departement: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ville, departement } = await params;
  const info = await getVilleBySlug(ville);
  const villeNom = info?.nom ?? ville.replace(/-/g, " ");
  const depNom = departement.replace(/-/g, " ");
  const title = `Pharmacie de garde ${villeNom} (${depNom})`;
  const description = `Pharmacies de garde à ${villeNom}, secteur ${depNom}. Adresses et téléphones.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function DepartementPage({ params }: PageProps) {
  const { ville, departement } = await params;
  const [info, pharmacies] = await Promise.all([
    getVilleBySlug(ville),
    getPharmaciesByVilleEtDepartement(ville, departement),
  ]);

  const villeNom = info?.nom ?? ville.replace(/-/g, " ");
  const depNom = departement.replace(/-/g, " ");

  return (
    <div className="space-y-8">
      <nav className="text-sm text-gray-500">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href={`/pharmacie-de-garde/${ville}`} className="hover:text-primary">
          {villeNom}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{depNom}</span>
      </nav>

      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Pharmacie de garde à {villeNom} ({depNom})
        </h1>
        <p className="mt-2 text-gray-600">
          {pharmacies.length} pharmacie{pharmacies.length !== 1 ? "s" : ""} de garde dans ce secteur.
        </p>
      </header>

      {pharmacies.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Liste des pharmacies</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pharmacies.map((p) => (
              <PharmacieCard key={p.id} pharmacie={p} />
            ))}
          </div>
        </section>
      )}

      {pharmacies.length > 0 && pharmacies.some((p) => p.latitude && p.longitude) && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Carte</h2>
          <MapView pharmacies={pharmacies} />
        </section>
      )}

      {pharmacies.length === 0 && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
          Aucune pharmacie de garde pour ce secteur.
        </p>
      )}
    </div>
  );
}
