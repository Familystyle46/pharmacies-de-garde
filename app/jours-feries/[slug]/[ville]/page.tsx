import type { Metadata } from "next";
import Link from "next/link";
import { JOURS_FERIES, TOP_VILLES, getJourFerieBySlug } from "@/lib/jours-feries";
import { notFound } from "next/navigation";

const SITE_URL = "https://pharmacies-de-garde.net";

interface PageProps {
  params: Promise<{ slug: string; ville: string }>;
}

export async function generateStaticParams() {
  const params: { slug: string; ville: string }[] = [];
  for (const jour of JOURS_FERIES) {
    for (const ville of TOP_VILLES) {
      params.push({ slug: jour.slug, ville: ville.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, ville: villeSlug } = await params;
  const jour = getJourFerieBySlug(slug);
  const ville = TOP_VILLES.find((v) => v.slug === villeSlug);
  if (!jour || !ville) return {};

  const title = `Pharmacie de Garde à ${ville.nom} — ${jour.nomComplet} ${jour.date2026.slice(0, 4)}`;
  const description = `Pharmacie de garde ouverte à ${ville.nom} le ${jour.nom.toLowerCase()} (${jour.dateLabel}). Trouvez la pharmacie de permanence dans votre secteur. Appelez le 3237 ou consultez la liste complète.`;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/jours-feries/${slug}/${villeSlug}`,
    },
  };
}

export default async function JourFerieVillePage({ params }: PageProps) {
  const { slug, ville: villeSlug } = await params;
  const jour = getJourFerieBySlug(slug);
  const ville = TOP_VILLES.find((v) => v.slug === villeSlug);
  if (!jour || !ville) notFound();

  const annee = jour.date2026.slice(0, 4);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Jours Fériés", item: `${SITE_URL}/jours-feries` },
      { "@type": "ListItem", position: 3, name: jour.nomComplet, item: `${SITE_URL}/jours-feries/${slug}` },
      { "@type": "ListItem", position: 4, name: ville.nom, item: `${SITE_URL}/jours-feries/${slug}/${villeSlug}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Y a-t-il une pharmacie de garde à ${ville.nom} le ${jour.nom} ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Oui. Une pharmacie de garde assure la permanence à ${ville.nom} le ${jour.nom} (${jour.dateLabel}). Pour connaître ses coordonnées, appelez le 3237 ou consultez la liste des pharmacies de garde à ${ville.nom} sur cette page.`,
        },
      },
      {
        "@type": "Question",
        name: `Comment trouver une pharmacie ouverte à ${ville.nom} le ${jour.nom} ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Trois options : (1) appelez le 3237 (disponible 24h/24, 7j/7, 0,35 €/min) ; (2) consultez la liste des pharmacies de garde à ${ville.nom} sur notre site ; (3) lisez l'affichage sur la porte de votre pharmacie habituelle.`,
        },
      },
      {
        "@type": "Question",
        name: `Quelle est la date du ${jour.nom} en ${annee} ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Le ${jour.nom} ${annee} tombe le ${jour.dateLabel}. La pharmacie de garde à ${ville.nom} est disponible toute la journée et la nuit précédente.`,
        },
      },
      {
        "@type": "Question",
        name: `Le 3237 fonctionne-t-il le ${jour.nom} à ${ville.nom} ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Oui, le 3237 fonctionne 24h/24, 7j/7, y compris le ${jour.nom.toLowerCase()} à ${ville.nom}. Ce numéro court vous redirige vers la pharmacie de garde disponible dans votre secteur.`,
        },
      },
    ],
  };

  // Autres jours fériés pour le maillage interne
  const autresJours = JOURS_FERIES.filter((j) => j.slug !== slug).slice(0, 5);

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Header */}
      <div
        className="py-12 px-4"
        style={{ background: "linear-gradient(180deg, #14532d 0%, #166534 50%, #16a34a 100%)" }}
      >
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-white/70 mb-4 flex flex-wrap items-center gap-1">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/jours-feries" className="hover:text-white transition-colors">Jours Fériés</Link>
            <span>/</span>
            <Link href={`/jours-feries/${slug}`} className="hover:text-white transition-colors">{jour.nomComplet}</Link>
            <span>/</span>
            <span className="text-white">{ville.nom}</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{jour.emoji}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              Pharmacie de Garde à {ville.nom} — {jour.nomComplet}
            </h1>
          </div>
          <p className="text-white/90 text-lg capitalize">{jour.dateLabel}</p>
        </div>
      </div>

      {/* Bannière 3237 */}
      <div className="bg-red-600 py-2.5 px-4 flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          🚨 Urgence : appelez le <strong>3237</strong> — disponible 24h/24, 7j/7
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

        {/* CTA principal */}
        <section className="rounded-2xl bg-green-50 border border-green-200 p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <p className="font-bold text-green-900 text-lg mb-1">
              Voir les pharmacies de garde à {ville.nom}
            </p>
            <p className="text-green-700 text-sm">
              Liste complète avec adresses, téléphones et horaires
            </p>
          </div>
          <Link
            href={`/pharmacie-de-garde/${villeSlug}`}
            className="flex-shrink-0 bg-green-700 text-white font-bold px-5 py-3 rounded-xl hover:bg-green-800 transition-colors text-sm"
          >
            Voir les pharmacies →
          </Link>
        </section>

        {/* Contenu éditorial */}
        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Pharmacie de garde à {ville.nom} le {jour.nom} {annee}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Le <strong>{jour.nom}</strong> ({jour.dateLabel}) est un <strong>jour férié</strong> en France : la quasi-totalité des pharmacies habituelles de {ville.nom} sont fermées. Une <strong>pharmacie de garde à {ville.nom}</strong> assure la permanence pharmaceutique toute la journée et la nuit, selon un calendrier établi par le Conseil départemental de l&apos;Ordre des Pharmaciens.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Pour trouver la pharmacie de garde ouverte à {ville.nom} le {jour.nom.toLowerCase()} {annee}, vous avez trois options : appeler le <strong>3237</strong> depuis votre téléphone (service disponible 24h/24, 0,35 €/min) ; consulter la liste des pharmacies de garde à {ville.nom} sur cette page ; ou lire l&apos;affichage obligatoire apposé sur la porte de votre pharmacie habituelle.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              En cas d&apos;urgence médicale grave, n&apos;attendez pas : appelez le <strong>15</strong> (SAMU), le <strong>18</strong> (Pompiers) ou le <strong>112</strong> (urgence européenne).
            </p>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Pharmacie de garde de nuit à {ville.nom} le {jour.nom}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              La nuit du {jour.nom.toLowerCase()}, une <strong>pharmacie de nuit à {ville.nom}</strong> reste ouverte pour délivrer les médicaments urgents. La permanence couvre la nuit précédente et la nuit suivante. Appelez le <strong>3237</strong> pour connaître l&apos;adresse exacte de la pharmacie de nuit disponible dans votre secteur à {ville.nom}.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Le 3237 — numéro national le {jour.nom} à {ville.nom}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Le <strong>3237</strong> est le numéro national de la permanence des soins pharmaceutiques. En l&apos;appelant depuis {ville.nom} le {jour.nom.toLowerCase()}, vous êtes automatiquement redirigé vers le service de régulation pharmaceutique de votre département, qui vous communique les coordonnées de la pharmacie de garde la plus proche. Le service est disponible <strong>24h/24, 7j/7</strong>, y compris tous les jours fériés.
            </p>
          </div>
        </section>

        {/* CTA pharmacies */}
        <section className="rounded-xl border border-gray-200 bg-gray-50 p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-gray-900">Pharmacies de garde à {ville.nom}</p>
            <p className="text-sm text-gray-500">Adresses, téléphones et horaires</p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <a
              href="tel:3237"
              className="bg-red-600 text-white font-bold px-4 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              📞 Appeler le 3237
            </a>
            <Link
              href={`/pharmacie-de-garde/${villeSlug}`}
              className="bg-white border border-green-600 text-green-700 font-bold px-4 py-2.5 rounded-lg text-sm hover:bg-green-50 transition-colors"
            >
              Liste pharmacies {ville.nom}
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Questions fréquentes — {ville.nom} le {jour.nom}
          </h2>
          <div className="space-y-3">
            {faqSchema.mainEntity.map(({ name, acceptedAnswer }) => (
              <details key={name} className="rounded-lg border border-gray-200 bg-white p-4 group">
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {name}
                  <span className="ml-2 text-gray-400 flex-shrink-0">▾</span>
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">{acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Maillage interne — autres villes pour ce jour */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Pharmacie de garde le {jour.nom} dans d&apos;autres villes
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {TOP_VILLES.filter((v) => v.slug !== villeSlug).slice(0, 12).map((v) => (
              <Link
                key={v.slug}
                href={`/jours-feries/${slug}/${v.slug}`}
                className="text-sm text-green-700 font-medium hover:underline py-1 px-2 rounded hover:bg-green-50 transition-colors"
              >
                {v.nom}
              </Link>
            ))}
          </div>
        </section>

        {/* Maillage interne — autres jours fériés pour cette ville */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Pharmacie de garde à {ville.nom} les autres jours fériés
          </h2>
          <div className="flex flex-wrap gap-2">
            {autresJours.map((j) => (
              <Link
                key={j.slug}
                href={`/jours-feries/${j.slug}/${villeSlug}`}
                className="text-sm bg-white border border-gray-200 text-gray-700 font-medium px-3 py-1.5 rounded-lg hover:border-green-600 hover:text-green-700 transition-colors"
              >
                {j.emoji} {j.nom}
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
