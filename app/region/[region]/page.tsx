import type { Metadata } from "next";
import Link from "next/link";
import { REGIONS, getRegionBySlug } from "@/lib/regions";
import { getDepartementByCode } from "@/lib/departements";
import { notFound } from "next/navigation";

const SITE_URL = "https://pharmacies-de-garde.net";

interface PageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region: regionSlug } = await params;
  const region = getRegionBySlug(regionSlug);
  if (!region) return {};

  const title = `Pharmacie de Garde en ${region.nom} — Nuit, Dimanche & Jours Fériés`;
  const description = `Trouvez une pharmacie de garde ouverte en ${region.nom} — la nuit, le dimanche et les jours fériés. Recherchez par ville ou département. Appelez le 3237.`;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/region/${regionSlug}`,
    },
  };
}

export async function generateStaticParams() {
  return REGIONS.map((r) => ({ region: r.slug }));
}

export default async function RegionPage({ params }: PageProps) {
  const { region: regionSlug } = await params;
  const region = getRegionBySlug(regionSlug);
  if (!region) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: region.nom, item: `${SITE_URL}/region/${regionSlug}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Comment trouver une pharmacie de garde en ${region.nom} ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Pour trouver une pharmacie de garde en ${region.nom}, recherchez par ville ou département sur cette page, ou appelez le 3237 depuis votre téléphone (disponible 24h/24, 7j/7).`,
        },
      },
      {
        "@type": "Question",
        name: `Quel numéro appeler pour une urgence pharmaceutique en ${region.nom} ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Composez le 3237 pour être redirigé vers la pharmacie de garde la plus proche en ${region.nom}. Pour une urgence médicale grave, appelez le 15 (SAMU), le 18 (Pompiers) ou le 112.`,
        },
      },
      {
        "@type": "Question",
        name: `Les pharmacies de garde en ${region.nom} sont-elles ouvertes la nuit et le dimanche ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Oui. Une pharmacie de garde est disponible 24h/24, 7j/7 en ${region.nom}, y compris la nuit, le dimanche et les jours fériés, selon un calendrier de rotation établi par le Conseil de l'Ordre des Pharmaciens.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <div
        className="py-12 px-4"
        style={{
          background: "linear-gradient(180deg, #14532d 0%, #166534 50%, #16a34a 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{region.nom}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Pharmacie de Garde en {region.nom}
          </h1>
          <p className="text-white/90 text-lg">
            Trouvez une pharmacie ouverte — nuit, dimanche & jours fériés
          </p>
        </div>
      </div>

      {/* Bannière 3237 */}
      <div className="bg-red-600 py-2.5 px-4 flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          🚨 Urgence : appelez le <strong>3237</strong> pour être mis en relation immédiatement
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

        {/* Villes principales */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pharmacies de garde par ville en {region.nom}
          </h2>
          <p className="text-gray-600 mb-6">
            Accédez directement aux pharmacies de garde dans les principales villes de la région.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {region.villes.map((ville) => (
              <Link
                key={ville.slug}
                href={`/pharmacie-de-garde/${ville.slug}`}
                className="group flex items-center gap-2 rounded-xl bg-white p-4 shadow-sm border border-gray-100 transition-all hover:border-green-600 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors text-sm">
                  {ville.nom}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Départements */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pharmacies de garde par département en {region.nom}
          </h2>
          <p className="text-gray-600 mb-6">
            Trouvez une pharmacie de garde dans chaque département de la région.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {region.departements.map((code) => {
              const dept = getDepartementByCode(code);
              if (!dept) return null;
              return (
                <Link
                  key={code}
                  href={`/departement/${code}`}
                  className="group flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-gray-100 transition-all hover:border-green-600 hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="text-sm font-bold text-gray-400 group-hover:text-green-600 transition-colors w-10 flex-shrink-0">
                    {code}
                  </span>
                  <span className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                    {dept.nom}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Section éditoriale */}
        <section className="rounded-xl bg-gray-50 border border-gray-200 p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Pharmacie de garde de nuit en {region.nom}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              La nuit, une <strong>pharmacie de garde en {region.nom}</strong> reste ouverte pour délivrer les médicaments urgents. Le service de permanence pharmaceutique est assuré 24h/24, 7j/7. Pour connaître la pharmacie de nuit la plus proche, appelez le <strong>3237</strong> ou recherchez directement votre ville dans la liste ci-dessus.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Pharmacie de garde dimanche en {region.nom}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Le dimanche et les jours fériés, les pharmacies de garde en {region.nom} fonctionnent par roulement selon un calendrier établi par le Conseil régional de l&apos;Ordre des Pharmaciens. Chaque département de la région {region.nom} dispose d&apos;au moins une pharmacie ouverte le dimanche. Appelez le <strong>3237</strong> pour être orienté vers la pharmacie ouverte la plus proche.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Questions fréquentes — pharmacie de garde en {region.nom}
          </h2>
          <div className="space-y-3">
            {[
              {
                q: `Comment trouver une pharmacie de garde en ${region.nom} ?`,
                a: `Recherchez par ville ou département sur cette page, ou appelez le 3237 (disponible 24h/24, 7j/7) pour être immédiatement redirigé vers la pharmacie de garde la plus proche en ${region.nom}.`,
              },
              {
                q: `Quel numéro appeler pour une urgence pharmaceutique en ${region.nom} ?`,
                a: `Composez le 3237 pour la permanence pharmaceutique en ${region.nom}. Pour une urgence médicale grave, appelez le 15 (SAMU), le 18 (Pompiers) ou le 112.`,
              },
              {
                q: `Les pharmacies de garde en ${region.nom} sont-elles ouvertes la nuit et le dimanche ?`,
                a: `Oui. Une pharmacie de garde est disponible 24h/24, 7j/7 en ${region.nom}, y compris la nuit, le dimanche et les jours fériés, selon un calendrier de rotation établi par l'Ordre des Pharmaciens.`,
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
