import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JOURS_FERIES, TOP_VILLES, getJourFerieBySlug } from "@/lib/jours-feries";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AdUnit } from "@/components/AdUnit";

const AD_SLOT_BOTTOM = "2611938233";
const SITE_URL = "https://pharmacies-de-garde.net";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return JOURS_FERIES.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const jour = getJourFerieBySlug(slug);
  if (!jour) return {};

  const title = `Pharmacie de Garde ${jour.nomComplet} ${jour.dateLabel} | Ouverte`;
  const description = jour.description;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/jours-feries/${slug}`,
    },
  };
}

export default async function JourFeriePage({ params }: PageProps) {
  const { slug } = await params;
  const jour = getJourFerieBySlug(slug);
  if (!jour) notFound();

  const breadcrumbItems = [
    { name: "Accueil", href: "/" },
    { name: "Jours Fériés", href: "/jours-feries" },
    { name: jour.nom, href: undefined },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: jour.faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Jours Fériés", item: `${SITE_URL}/jours-feries` },
      { "@type": "ListItem", position: 3, name: jour.nom, item: `${SITE_URL}/jours-feries/${slug}` },
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

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Hero */}
      <div
        className="py-12 px-4"
        style={{
          background: "linear-gradient(180deg, #14532d 0%, #166534 50%, #16a34a 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-4xl mb-3">{jour.emoji}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Pharmacie de Garde — {jour.nomComplet}
          </h1>
          <p className="text-white/90 text-lg mb-4">{jour.dateLabel}</p>
          {jour.fixedLabel && (
            <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white">
              📅 {jour.fixedLabel}
            </span>
          )}
        </div>
      </div>

      {/* Bannière urgence */}
      <div className="bg-red-600 py-2.5 px-4 flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          🚨 Urgence : appelez le <strong>3237</strong> pour être mis en relation immédiatement
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Description */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-5 mb-8">
          <p className="text-amber-900 text-sm leading-relaxed">{jour.description}</p>
        </div>

        {/* Recherche par ville */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Trouver une pharmacie ouverte {jour.dateLabel}
          </h2>
          <p className="text-gray-600 text-sm mb-5">
            Sélectionnez votre ville pour voir les pharmacies de garde disponibles.
          </p>

          {/* Grille villes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {TOP_VILLES.map((v) => (
              <Link
                key={v.slug}
                href={`/pharmacie-de-garde/${v.slug}`}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary hover:shadow-sm transition-all"
              >
                <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {v.nom}
              </Link>
            ))}
          </div>
        </section>

        {/* Info card */}
        <section className="rounded-xl bg-gray-50 border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Pharmacies de garde le {jour.dateLabel}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Le <strong>{jour.nomComplet}</strong> est un jour férié en France. La quasi-totalité des pharmacies
            habituelles sont fermées. Une <strong>pharmacie de garde</strong> assure la permanence dans chaque secteur
            selon un calendrier de rotation établi par le Conseil de l&apos;Ordre des Pharmaciens.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Pour connaître la pharmacie de garde la plus proche de chez vous, trois options :
          </p>
          <ul className="text-gray-600 text-sm leading-relaxed space-y-1.5 ml-4 list-disc mb-3">
            <li>
              <strong>Appelez le 3237</strong> — service de permanence des soins disponible 24h/24
            </li>
            <li>
              <strong>Recherchez votre ville</strong> dans la grille ci-dessus
            </li>
            <li>
              <strong>Consultez l&apos;affichage</strong> sur la porte de votre pharmacie habituelle
            </li>
          </ul>
          {jour.date2027 && (
            <p className="text-gray-500 text-xs">
              📅 Prochain {jour.nom} : {
                jour.fixedLabel
                  ? `${jour.date2027.split("-")[2].replace(/^0/, "")} ${["", "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"][parseInt(jour.date2027.split("-")[1])]} ${jour.date2027.split("-")[0]}`
                  : jour.date2027
              }
            </p>
          )}
        </section>

        {/* Autres jours fériés */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Autres jours fériés</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {JOURS_FERIES.filter((j) => j.slug !== slug).map((j) => (
              <Link
                key={j.slug}
                href={`/jours-feries/${j.slug}`}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm hover:border-primary hover:shadow-sm transition-all group"
              >
                <span className="text-xl">{j.emoji}</span>
                <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                  {j.nom}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Pub */}
        <AdUnit
          slot={AD_SLOT_BOTTOM}
          format="horizontal"
          className="my-8"
          style={{ minHeight: 90 }}
        />

        {/* FAQ */}
        <section className="mt-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Questions fréquentes — {jour.nom}
          </h2>
          <div className="space-y-3">
            {jour.faq.map(({ q, a }) => (
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

        <div className="mt-8">
          <Link
            href="/jours-feries"
            className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-hover transition-colors"
          >
            ← Tous les jours fériés
          </Link>
        </div>
      </div>
    </div>
  );
}
