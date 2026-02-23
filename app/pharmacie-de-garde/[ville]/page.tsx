import type { Metadata } from "next";
import Link from "next/link";
import {
  getPharmaciesByVille,
  getVilleBySlug,
  getDepartementsByVille,
  getAllVillesSlugs,
  getVillesProches,
  getPharmacieSlug,
} from "@/lib/pharmacies";
import { getDepartementByCode } from "@/lib/departements";
import type { Pharmacie } from "@/lib/pharmacies";
import { PharmacieCard } from "@/components/PharmacieCard";
import { MapView } from "@/components/MapView";
import { Breadcrumb } from "@/components/Breadcrumb";
import { VillesProches } from "@/components/VillesProches";

const SITE_URL = "https://pharmacies-de-garde.net";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ ville: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ville } = await params;
  const info = await getVilleBySlug(ville);
  const villeNom = info?.nom ?? ville.replace(/-/g, " ");
  const title = `${villeNom} - Pharmacie de Garde | Horaires & Adresses`;
  const description = `Trouvez la pharmacie de garde à ${villeNom} ouverte maintenant. Liste complète avec adresses, téléphones et horaires. Mis à jour en temps réel.`;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/pharmacie-de-garde/${ville}`,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllVillesSlugs();
  const filtered = slugs
    .filter((slug): slug is string => {
      if (typeof slug !== "string") return false;
      const s = slug.trim();
      return s.length > 0 && !s.includes("/") && s !== "undefined" && s !== "null";
    })
    .slice(0, 50);
  if (filtered.length === 0) {
    return [{ ville: "paris" }, { ville: "lyon" }, { ville: "marseille" }];
  }
  return filtered.map((slug) => ({ ville: slug }));
}

function pharmacieToJsonLd(p: Pharmacie, index: number) {
  const address = {
    "@type": "PostalAddress",
    streetAddress: p.adresse,
    addressLocality: p.ville,
    postalCode: p.code_postal,
    addressCountry: "FR",
  };
  const base: Record<string, unknown> = {
    "@type": ["Pharmacy", "LocalBusiness"],
    name: p.nom,
    address,
    ...(p.telephone && { telephone: p.telephone }),
    ...(p.horaires && { openingHours: p.horaires }),
  };
  if (p.latitude != null && p.longitude != null) {
    base.geo = {
      "@type": "GeoCoordinates",
      latitude: p.latitude,
      longitude: p.longitude,
    };
  }
  return { "@type": "ListItem", position: index + 1, item: base };
}

export default async function VillePage({ params }: PageProps) {
  const { ville } = await params;
  const [info, pharmacies, departements] = await Promise.all([
    getVilleBySlug(ville),
    getPharmaciesByVille(ville),
    getDepartementsByVille(ville),
  ]);
  const departementCode = (departements[0]?.slug ?? info?.departement ?? "").replace(/-/g, "");
  const departementInfo = getDepartementByCode(departementCode);
  const departementNom = departementInfo?.nom ?? departements[0]?.nom ?? departementCode;
  const villesProches = await getVillesProches(departementCode, ville);

  const villeNom = info?.nom ?? ville.replace(/-/g, " ");
  const hasMap = pharmacies.length > 0 && pharmacies.some((p) => p.latitude && p.longitude);

  const breadcrumbItems = [
    { name: "Accueil", href: "/" },
    ...(departementCode && departementNom
      ? [{ name: departementNom, href: `/departement/${departementCode}` }]
      : []),
    { name: villeNom, href: undefined },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
      ...(departementCode && departementNom ? [{ "@type": "ListItem", position: 2, name: departementNom, item: `${SITE_URL}/departement/${departementCode}` }] : []),
      { "@type": "ListItem", position: breadcrumbItems.length, name: villeNom, item: `${SITE_URL}/pharmacie-de-garde/${ville}` },
    ],
  };

  const pharmaciesSchema =
    pharmacies.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Pharmacies de garde à ${villeNom}`,
          numberOfItems: pharmacies.length,
          itemListElement: pharmacies.map((p, i) => pharmacieToJsonLd(p, i)),
        }
      : null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Comment trouver une pharmacie de garde à ${villeNom} ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Pour trouver une pharmacie de garde à ${villeNom}, consultez la liste complète sur cette page ou appelez le 3237 pour être mis en relation immédiatement avec la pharmacie de garde la plus proche.`,
        },
      },
      {
        "@type": "Question",
        name: `Quel numéro appeler pour une urgence pharmaceutique à ${villeNom} ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Appelez le 3237 (service de permanence des soins) pour obtenir les coordonnées de la pharmacie de garde à ${villeNom}. Pour les urgences médicales graves, composez le 15 (SAMU), le 18 (Pompiers) ou le 112.`,
        },
      },
      {
        "@type": "Question",
        name: `Les pharmacies de garde à ${villeNom} sont-elles ouvertes la nuit et le week-end ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Oui. Les pharmacies de garde à ${villeNom} assurent une permanence les nuits, les dimanches et les jours fériés. Le calendrier de rotation est établi par le Conseil de l'Ordre des Pharmaciens${departementNom ? ` du ${departementNom}` : ""}.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {pharmaciesSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pharmaciesSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Header */}
      <div
        className="py-10 px-4"
        style={{
          background: "linear-gradient(180deg, #14532d 0%, #166534 50%, #16a34a 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Pharmacies de Garde à {villeNom}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <span
              className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white"
            >
              {pharmacies.length} pharmacie{pharmacies.length !== 1 ? "s" : ""} trouvée
              {pharmacies.length !== 1 ? "s" : ""}
            </span>
            {departements.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {departements.map((dep) => (
                  <Link
                    key={dep.slug}
                    href={`/pharmacie-de-garde/${ville}/${dep.slug}`}
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20 transition-colors"
                  >
                    {dep.nom} ({dep.count})
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bannière 3237 */}
      <div className="bg-red-600 py-2.5 px-4 flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          🚨 Urgence : appelez le <strong>3237</strong> pour être mis en relation immédiatement
        </span>
      </div>

      {/* Contenu principal : 60% liste | 40% carte */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Colonne gauche : liste (60% desktop) */}
          <div className="lg:w-[60%] lg:flex-shrink-0">
            {pharmacies.length > 0 ? (
              <div className="space-y-4">
                {pharmacies.map((p) => (
                  <PharmacieCard
                    key={p.id}
                    pharmacie={p}
                    villeSlug={ville}
                    pharmacieSlug={getPharmacieSlug(p.nom)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
                Aucune pharmacie de garde enregistrée pour cette ville. Essayez une autre recherche.
              </div>
            )}
          </div>

          {/* Colonne droite : carte sticky (40% desktop, en dessous sur mobile) */}
          {hasMap && (
            <div className="mt-8 lg:mt-0 lg:w-[40%] lg:flex-shrink-0 lg:sticky lg:top-24">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <MapView pharmacies={pharmacies} />
              </div>
            </div>
          )}
        </div>

        {/* Villes proches */}
        {villesProches.length > 0 && (
          <div className="mt-12">
            <VillesProches villes={villesProches} />
          </div>
        )}

        {/* Section À savoir */}
        <section className="mt-12 rounded-xl bg-gray-50 border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            À savoir : pharmacie de garde à {villeNom}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Les pharmacies de garde à <strong>{villeNom}</strong>
            {departementNom ? ` (${departementNom})` : ""} assurent un service de permanence en dehors
            des horaires habituels : nuits, dimanches et jours fériés. Ce service est organisé par le
            Conseil de l&apos;Ordre des Pharmaciens selon un calendrier de rotation mensuel.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            {pharmacies.length > 0 ? (
              <>
                <strong>{pharmacies.length} pharmacie{pharmacies.length > 1 ? "s" : ""}</strong> assure{pharmacies.length > 1 ? "nt" : ""} actuellement la garde à {villeNom}.
                Pour obtenir les coordonnées de la pharmacie de garde, appelez le <strong>3237</strong>.
              </>
            ) : (
              <>
                Pour obtenir les coordonnées de la pharmacie de garde à {villeNom}, appelez le <strong>3237</strong>.
                Ce service vous oriente vers la pharmacie de garde la plus proche ouverte.
              </>
            )}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed m-0">
            En cas d&apos;urgence médicale grave : <strong>15</strong> (SAMU), <strong>18</strong> (Pompiers),
            <strong> 112</strong> (urgence européenne). Pharmacie de garde : <strong>3237</strong>.
          </p>
        </section>

        {/* Section FAQ */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Questions fréquentes — pharmacie de garde à {villeNom}
          </h2>
          <div className="space-y-3">
            {[
              {
                q: `Comment trouver une pharmacie de garde à ${villeNom} ?`,
                a: `Consultez la liste complète sur cette page ou appelez le 3237 pour être mis en relation immédiatement avec la pharmacie de garde la plus proche à ${villeNom}.`,
              },
              {
                q: `Quel numéro appeler pour une urgence pharmaceutique à ${villeNom} ?`,
                a: `Appelez le 3237 (service de permanence des soins) disponible 24h/24. Pour les urgences médicales graves, composez le 15 (SAMU), le 18 (Pompiers) ou le 112.`,
              },
              {
                q: `Les pharmacies de garde à ${villeNom} sont-elles ouvertes la nuit et le week-end ?`,
                a: `Oui. Les pharmacies de garde à ${villeNom} assurent une permanence les nuits, les dimanches et les jours fériés selon un calendrier de rotation mensuel établi par le Conseil de l'Ordre des Pharmaciens${departementNom ? ` du ${departementNom}` : ""}.`,
              },
            ].map(({ q, a }) => (
              <details key={q} className="rounded-lg border border-gray-200 bg-white p-4 group">
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {q}
                  <span className="ml-2 text-gray-400 flex-shrink-0">▾</span>
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
