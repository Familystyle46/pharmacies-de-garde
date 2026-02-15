import type { Metadata } from "next";
import Link from "next/link";
import {
  getPharmaciesByVille,
  getVilleBySlug,
  getDepartementsByVille,
  getVilles,
} from "@/lib/pharmacies";
import { PharmacyCard } from "@/components/PharmacyCard";
import { MapView } from "@/components/MapView";

interface PageProps {
  params: Promise<{ ville: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ville } = await params;
  const info = await getVilleBySlug(ville);
  const title = info ? `Pharmacie de garde ${info.nom}` : `Pharmacie de garde ${ville}`;
  const description = info
    ? `Liste des pharmacies de garde à ${info.nom}. Adresses, téléphones et horaires.`
    : `Pharmacies de garde pour la ville ${ville}.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export async function generateStaticParams() {
  const villes = await getVilles();
  if (villes.length === 0) {
    return [{ ville: "paris" }, { ville: "lyon" }, { ville: "marseille" }];
  }
  return villes.slice(0, 50).map((v) => ({ ville: v.slug }));
}

export default async function VillePage({ params }: PageProps) {
  const { ville } = await params;
  const [info, pharmacies, departements] = await Promise.all([
    getVilleBySlug(ville),
    getPharmaciesByVille(ville),
    getDepartementsByVille(ville),
  ]);

  const villeNom = info?.nom ?? ville.replace(/-/g, " ");
  const hasMap = pharmacies.length > 0 && pharmacies.some((p) => p.latitude && p.longitude);

  return (
    <div>
      {/* Header page ville */}
      <div
        className="py-8 px-6 pb-9"
        style={{ background: "linear-gradient(135deg, #14532d, #166534)" }}
      >
        <div className="max-w-[960px] mx-auto">
          <Link
            href="/"
            className="inline-block mb-4 rounded-lg border-0 text-white px-3.5 py-1.5 text-[13px]"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            ← Retour
          </Link>
          <h1
            className="text-white font-extrabold mb-2 font-serif"
            style={{ fontSize: "clamp(22px, 4vw, 34px)" }}
          >
            Pharmacie de garde à {villeNom}
          </h1>
          <p className="text-white/75 text-[15px] m-0">
            {pharmacies.length} pharmacie{pharmacies.length !== 1 ? "s" : ""} de garde trouvée
            {pharmacies.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Bannière 3237 */}
      <div className="bg-red-600 py-2.5 px-6 flex items-center justify-center gap-2.5 flex-wrap">
        <span className="text-white text-sm font-medium">
          🚨 Urgence : appelez le <strong>3237</strong> pour être mis en relation immédiatement
        </span>
      </div>

      {/* AdSense 728x90 */}
      <div className="max-w-[960px] mx-auto mt-4 px-6">
        <div
          className="h-[90px] rounded-lg flex items-center justify-center text-gray-400 text-xs"
          style={{ background: "#f3f4f6", border: "1px dashed #d1d5db" }}
        >
          [Espace publicitaire 728×90 — AdSense]
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-[960px] mx-auto mt-6 px-6 flex gap-6 flex-wrap">
        {/* Colonne liste */}
        <div className="flex-1 min-w-0" style={{ flexBasis: "340px" }}>
          {departements.length > 1 && (
            <div className="mb-4">
              <h2 className="mb-3 text-base font-semibold text-gray-900">Par département / secteur</h2>
              <div className="flex flex-wrap gap-2">
                {departements.map((dep) => (
                  <Link
                    key={dep.slug}
                    href={`/pharmacie-de-garde/${ville}/${dep.slug}`}
                    className="rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-primary hover:bg-green-200"
                  >
                    {dep.nom} ({dep.count})
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 m-0">Pharmacies disponibles</h2>
            {pharmacies.length > 0 && (
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: "#dcfce7", color: "#16a34a" }}
              >
                {pharmacies.length} résultats
              </span>
            )}
          </div>

          {pharmacies.length > 0 ? (
            pharmacies.map((p) => <PharmacyCard key={p.id} pharmacie={p} />)
          ) : (
            <p
              className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800"
            >
              Aucune pharmacie de garde enregistrée pour cette ville. Essayez une autre recherche.
            </p>
          )}
        </div>

        {/* Colonne droite : carte + ad */}
        {hasMap && (
          <div className="flex-1 min-w-0 sticky top-20" style={{ flexBasis: "300px" }}>
            <MapView pharmacies={pharmacies} />
            {/* Placeholder 300x250 */}
            <div
              className="mt-4 h-[250px] rounded-lg flex items-center justify-center text-gray-400 text-xs"
              style={{ background: "#f3f4f6", border: "1px dashed #d1d5db" }}
            >
              [Espace publicitaire 300×250]
            </div>
          </div>
        )}
      </div>

      {/* Info block SEO */}
      <div className="max-w-[960px] mx-auto mb-12 px-6">
        <div className="rounded-[14px] p-6 border border-gray-200" style={{ background: "#f9fafb" }}>
          <h2 className="text-[17px] font-bold text-gray-900 mb-3">
            Comment trouver une pharmacie de garde à {villeNom} ?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Les pharmacies de garde à <strong>{villeNom}</strong> assurent un service de permanence en dehors des
            horaires habituels d&apos;ouverture. Ce service est organisé par le Conseil de l&apos;Ordre des Pharmaciens
            de votre département, selon un calendrier de rotation.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed m-0">
            En cas d&apos;urgence médicale grave, composez le <strong>15 (SAMU)</strong>, le{" "}
            <strong>18 (Pompiers)</strong> ou le <strong>112 (Numéro d&apos;urgence européen)</strong>. Pour localiser
            rapidement la pharmacie de garde la plus proche, appelez le <strong>3237</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
