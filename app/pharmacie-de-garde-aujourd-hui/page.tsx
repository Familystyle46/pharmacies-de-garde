import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

const SITE_URL = "https://pharmacies-de-garde.net";

const TOP_VILLES = [
  { nom: "Paris", slug: "paris" },
  { nom: "Marseille", slug: "marseille" },
  { nom: "Lyon", slug: "lyon" },
  { nom: "Toulouse", slug: "toulouse" },
  { nom: "Nice", slug: "nice" },
  { nom: "Nantes", slug: "nantes" },
  { nom: "Montpellier", slug: "montpellier" },
  { nom: "Strasbourg", slug: "strasbourg" },
  { nom: "Bordeaux", slug: "bordeaux" },
  { nom: "Lille", slug: "lille" },
  { nom: "Rennes", slug: "rennes" },
  { nom: "Reims", slug: "reims" },
  { nom: "Saint-Étienne", slug: "saint-etienne" },
  { nom: "Toulon", slug: "toulon" },
  { nom: "Le Havre", slug: "le-havre" },
  { nom: "Grenoble", slug: "grenoble" },
  { nom: "Dijon", slug: "dijon" },
  { nom: "Angers", slug: "angers" },
  { nom: "Nîmes", slug: "nimes" },
  { nom: "Villeurbanne", slug: "villeurbanne" },
  { nom: "Aix-en-Provence", slug: "aix-en-provence" },
  { nom: "Clermont-Ferrand", slug: "clermont-ferrand" },
  { nom: "Brest", slug: "brest" },
  { nom: "Limoges", slug: "limoges" },
  { nom: "Tours", slug: "tours" },
  { nom: "Amiens", slug: "amiens" },
  { nom: "Metz", slug: "metz" },
  { nom: "Nancy", slug: "nancy" },
  { nom: "Perpignan", slug: "perpignan" },
  { nom: "Rouen", slug: "rouen" },
];

function getJourSemaineFr(date: Date): string {
  const jours = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  return jours[date.getDay()];
}

function getMoisFr(date: Date): string {
  const mois = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];
  return mois[date.getMonth()];
}

function formatDateFr(date: Date): string {
  const jour = getJourSemaineFr(date);
  const num = date.getDate();
  const mois = getMoisFr(date);
  const annee = date.getFullYear();
  return `${jour} ${num} ${mois} ${annee}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const today = new Date();
  const dateFr = formatDateFr(today);
  const title = `Pharmacie de Garde Aujourd'hui — ${dateFr.charAt(0).toUpperCase() + dateFr.slice(1)}`;
  const description = `Trouvez une pharmacie de garde ouverte aujourd'hui (${dateFr}). Recherchez par ville ou appelez le 3237 pour être mis en relation immédiatement.`;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/pharmacie-de-garde-aujourd-hui`,
    },
  };
}

export default function AujourdhuiPage() {
  const today = new Date();
  const dateFr = formatDateFr(today);
  const jourSemaine = getJourSemaineFr(today);
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Comment trouver une pharmacie de garde ouverte aujourd'hui ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recherchez votre ville dans la liste ci-dessus ou appelez le 3237 (disponible 24h/24, 7j/7). Ce service vous indique immédiatement la pharmacie de garde la plus proche ouverte.",
        },
      },
      {
        "@type": "Question",
        name: "Les pharmacies sont-elles ouvertes aujourd'hui ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Les pharmacies habituelles peuvent être fermées le soir, le dimanche ou les jours fériés. Mais une pharmacie de garde est toujours disponible 24h/24, 7j/7. Appelez le 3237 pour trouver la pharmacie ouverte la plus proche.",
        },
      },
      {
        "@type": "Question",
        name: "Quel numéro appeler si toutes les pharmacies sont fermées ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Appelez le 3237 (permanence des soins pharmaceutiques, disponible 24h/24). Pour une urgence médicale grave, composez le 15 (SAMU), le 18 (Pompiers) ou le 112.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Pharmacie de garde aujourd'hui", item: `${SITE_URL}/pharmacie-de-garde-aujourd-hui` },
    ],
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
            <span className="text-white">Pharmacie de garde aujourd&apos;hui</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Pharmacie de Garde Aujourd&apos;hui
          </h1>
          <p className="text-white/90 text-lg capitalize">
            {dateFr} — Trouvez une pharmacie ouverte près de chez vous
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

        {/* Alerte jour */}
        {isWeekend && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-5 flex gap-3 items-start">
            <span className="text-2xl flex-shrink-0">📅</span>
            <div>
              <p className="font-semibold text-amber-800 mb-1">
                Aujourd&apos;hui c&apos;est {jourSemaine} — de nombreuses pharmacies sont fermées
              </p>
              <p className="text-amber-700 text-sm">
                Une pharmacie de garde assure la permanence dans votre secteur. Sélectionnez votre ville ci-dessous ou appelez le <strong>3237</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Grille villes */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pharmacie de garde ouverte aujourd&apos;hui par ville
          </h2>
          <p className="text-gray-600 mb-6">
            Sélectionnez votre ville pour voir les pharmacies de garde disponibles.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {TOP_VILLES.map((ville) => (
              <Link
                key={ville.slug}
                href={`/pharmacie-de-garde/${ville.slug}`}
                className="group flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm border border-gray-100 transition-all hover:border-green-600 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center text-green-700 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-900 group-hover:text-green-700 transition-colors text-sm truncate">
                  {ville.nom}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section éditoriale */}
        <section className="rounded-xl bg-gray-50 border border-gray-200 p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Pharmacie ouverte aujourd&apos;hui : que faire ?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Si votre pharmacie habituelle est fermée aujourd&apos;hui, une <strong>pharmacie de garde</strong> est toujours disponible dans votre secteur. Le service de permanence pharmaceutique fonctionne <strong>24h/24, 7j/7</strong>, y compris les nuits, dimanches et jours fériés.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Trois solutions pour trouver la pharmacie ouverte aujourd&apos;hui : <strong>(1)</strong> appelez le <strong>3237</strong> (0,35 €/min depuis un fixe ou un mobile) ; <strong>(2)</strong> consultez la liste par ville ci-dessus ; <strong>(3)</strong> lisez l&apos;affichage obligatoire sur la porte de votre pharmacie habituelle.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Pharmacie de garde de nuit aujourd&apos;hui
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Le soir et la nuit, les pharmacies ordinaires ferment. Une <strong>pharmacie de nuit</strong> est désignée dans chaque secteur pour assurer la permanence. Elle peut vous délivrer des médicaments sur ordonnance ou sans ordonnance urgents. Pour la trouver rapidement, appelez le <strong>3237</strong> depuis votre téléphone — le service vous indique les coordonnées et l&apos;adresse.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "Comment trouver une pharmacie de garde ouverte aujourd'hui ?",
                a: "Sélectionnez votre ville dans la liste ci-dessus ou appelez le 3237 (disponible 24h/24, 7j/7). Ce numéro court vous met en relation avec la pharmacie de garde la plus proche de chez vous.",
              },
              {
                q: "Les pharmacies sont-elles ouvertes aujourd'hui ?",
                a: "Les pharmacies habituelles peuvent être fermées le soir, le dimanche ou les jours fériés. Mais une pharmacie de garde est toujours disponible 24h/24. Appelez le 3237 pour trouver la pharmacie ouverte la plus proche.",
              },
              {
                q: "Quel numéro appeler si toutes les pharmacies sont fermées ?",
                a: "Appelez le 3237 (permanence des soins pharmaceutiques, disponible 24h/24). Pour une urgence médicale grave, composez le 15 (SAMU), le 18 (Pompiers) ou le 112.",
              },
              {
                q: "Le 3237 est-il disponible aujourd'hui ?",
                a: "Oui, le 3237 est disponible tous les jours, 24h/24, 7j/7, y compris les dimanches et jours fériés. Le service est facturé 0,35 €/min depuis un téléphone fixe ou mobile.",
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

        {/* Liens utiles */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Liens utiles</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/3237-pharmacie-de-garde" className="text-sm text-green-700 font-medium hover:underline">
              → Le 3237 : tout savoir
            </Link>
            <Link href="/jours-feries" className="text-sm text-green-700 font-medium hover:underline">
              → Jours fériés en France
            </Link>
            <Link href="/" className="text-sm text-green-700 font-medium hover:underline">
              → Recherche par ville
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
