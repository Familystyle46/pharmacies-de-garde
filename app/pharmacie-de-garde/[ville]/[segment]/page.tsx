import type { Metadata } from "next";
import Link from "next/link";
import {
  getPharmacieBySlug,
  getPharmaciesByVille,
  getPharmaciesByVilleEtDepartement,
  getVilleBySlug,
  getDepartementsByVille,
  getAllPharmaciesSlugs,
  getPharmacieSlug,
} from "@/lib/pharmacies";
import { getDepartementByCode } from "@/lib/departements";
import type { Pharmacie } from "@/lib/pharmacies";
import { PharmacieCard } from "@/components/PharmacieCard";
import { MapView } from "@/components/MapView";
import { Breadcrumb } from "@/components/Breadcrumb";
import { HorairesDisplay } from "@/components/HorairesDisplay";

const SITE_URL = "https://pharmacies-de-garde.net";

/** Codes département français (2 chiffres, 2A/2B, 971-976) */
function isDepartementCode(segment: string): boolean {
  const s = segment.trim();
  if (/^\d{2}$/.test(s)) return true;
  if (/^2[AB]$/i.test(s)) return true;
  if(/^97[1-6]$/.test(s)) return true;
  return false;
}

interface PageProps {
  params: Promise<{ ville: string; segment: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ville, segment } = await params;
  const info = await getVilleBySlug(ville);
  const villeNom = info?.nom ?? ville.replace(/-/g, " ");

  if (isDepartementCode(segment)) {
    const depNom = segment.replace(/-/g, " ");
    return {
      title: `Pharmacie de garde ${villeNom} (${depNom})`,
      description: `Pharmacies de garde à ${villeNom}, secteur ${depNom}. Adresses et téléphones.`,
      openGraph: {
        title: `Pharmacie de garde ${villeNom} (${depNom})`,
        description: `Pharmacies de garde à ${villeNom}, secteur ${depNom}. Adresses et téléphones.`,
      },
    };
  }

  const p = await getPharmacieBySlug(ville, segment);
  const nom = p?.nom ?? segment.replace(/-/g, " ");
  const title = `${nom} - Pharmacie de Garde à ${villeNom} | Horaires & Contact`;
  const description = `Pharmacie ${nom} située ${p?.adresse ?? ""}, ${villeNom}. Téléphone, horaires d'ouverture et itinéraire pour la pharmacie de garde.`;
  return { title, description, openGraph: { title, description } };
}

export async function generateStaticParams() {
  const pairs = await getAllPharmaciesSlugs();
  const filtered = pairs
    .filter(
      (x) =>
        x.ville_slug &&
        x.pharmacie_slug &&
        !x.ville_slug.includes("/") &&
        !x.pharmacie_slug.includes("/")
    )
    .slice(0, 1000);
  if (filtered.length === 0) {
    return [
      { ville: "paris", segment: "pharmacie-du-centre" },
      { ville: "lyon", segment: "pharmacie" },
    ];
  }
  return filtered.map(({ ville_slug, pharmacie_slug }) => ({
    ville: ville_slug,
    segment: pharmacie_slug,
  }));
}

function pharmacyJsonLd(p: Pharmacie) {
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    name: p.nom,
    address: {
      "@type": "PostalAddress",
      streetAddress: p.adresse,
      addressLocality: p.ville,
      postalCode: p.code_postal,
      addressCountry: "FR",
    },
    ...(p.telephone && { telephone: p.telephone }),
  };
  if (p.latitude != null && p.longitude != null) {
    base.geo = {
      "@type": "GeoCoordinates",
      latitude: p.latitude,
      longitude: p.longitude,
    };
  }
  return base;
}

function googleMapsDirUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export default async function VilleSegmentPage({ params }: PageProps) {
  const { ville, segment } = await params;

  const isDept = isDepartementCode(segment);

  if (isDept) {
    const [info, pharmacies] = await Promise.all([
      getVilleBySlug(ville),
      getPharmaciesByVilleEtDepartement(ville, segment),
    ]);
    const villeNom = info?.nom ?? ville.replace(/-/g, " ");
    const depNom = segment.replace(/-/g, " ");

    return (
      <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
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
                <PharmacieCard
                  key={p.id}
                  pharmacie={p}
                  villeSlug={ville}
                  pharmacieSlug={getPharmacieSlug(p.nom)}
                />
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

  // Page pharmacie individuelle
  const [p, info, departements, pharmaciesVille] = await Promise.all([
    getPharmacieBySlug(ville, segment),
    getVilleBySlug(ville),
    getDepartementsByVille(ville),
    getPharmaciesByVille(ville),
  ]);

  const villeNom = info?.nom ?? ville.replace(/-/g, " ");
  const departementCode = (departements[0]?.slug ?? info?.departement ?? "").replace(/-/g, "");
  const departementInfo = getDepartementByCode(departementCode);
  const departementNom = departementInfo?.nom ?? departements[0]?.nom ?? departementCode;

  const autresPharmacies = pharmaciesVille
    .filter((x) => getPharmacieSlug(x.nom) !== segment)
    .slice(0, 5);

  const breadcrumbItems = [
    { name: "Accueil", href: "/" },
    ...(departementCode && departementNom
      ? [{ name: departementNom, href: `/departement/${departementCode}` }]
      : []),
    { name: villeNom, href: `/pharmacie-de-garde/${ville}` },
    { name: p?.nom ?? segment, href: undefined },
  ];

  if (!p) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-4">
          Pharmacie introuvable.
        </p>
        <Link href={`/pharmacie-de-garde/${ville}`} className="mt-4 inline-block text-primary hover:underline">
          ← Retour aux pharmacies de garde à {villeNom}
        </Link>
      </div>
    );
  }

  const hasMap = p.latitude != null && p.longitude != null;

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pharmacyJsonLd(p)) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div
        className="py-10 px-4"
        style={{
          background: "linear-gradient(180deg, #14532d 0%, #166534 50%, #16a34a 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{p.nom}</h1>
          <p className="text-white/90 text-lg">Pharmacie de garde à {villeNom}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          <div className="lg:w-[60%] space-y-6">
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3">
                <p className="text-gray-600">
                  {p.adresse}, {p.code_postal} {p.ville}
                </p>
                {p.telephone && (
                  <a
                    href={`tel:${p.telephone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {p.telephone}
                  </a>
                )}
                <div className="text-sm">
                  <span className="font-medium text-gray-900">Horaires :</span>{" "}
                  <HorairesDisplay horaires={p.horaires} showOpenNow />
                </div>
              </div>
              {hasMap && (
                <a
                  href={googleMapsDirUrl(p.latitude!, p.longitude!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Itinéraire Google Maps
                </a>
              )}
            </section>

            {autresPharmacies.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Autres pharmacies de garde à {villeNom}
                </h2>
                <div className="space-y-4">
                  {autresPharmacies.map((ph) => (
                    <PharmacieCard
                      key={ph.id}
                      pharmacie={ph}
                      villeSlug={ville}
                      pharmacieSlug={getPharmacieSlug(ph.nom)}
                    />
                  ))}
                </div>
                <Link
                  href={`/pharmacie-de-garde/${ville}`}
                  className="mt-4 inline-block text-primary font-medium hover:underline"
                >
                  Voir toutes les pharmacies de garde à {villeNom} →
                </Link>
              </section>
            )}
          </div>

          {hasMap && (
            <div className="mt-8 lg:mt-0 lg:w-[40%] lg:flex-shrink-0 lg:sticky lg:top-24">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <MapView
                  pharmacies={[p]}
                  center={[p.latitude!, p.longitude!]}
                  zoom={15}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
