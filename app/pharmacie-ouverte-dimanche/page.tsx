import type { Metadata } from "next";
import Link from "next/link";
import { TOP_VILLES } from "@/lib/jours-feries";

export const dynamic = "force-dynamic";

const SITE_URL = "https://pharmacies-de-garde.net";

const title = "Pharmacie Ouverte Dimanche — Trouvez la Pharmacie de Garde";
const description =
  "Trouvez une pharmacie ouverte dimanche près de chez vous. Chaque dimanche, une pharmacie de garde assure la permanence dans votre secteur. Cherchez par ville ou appelez le 3237.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  alternates: { canonical: `${SITE_URL}/pharmacie-ouverte-dimanche` },
};

export default function PharmacieDimanchePage() {
  const now = new Date();
  const isThisDimanche = now.getDay() === 0;
  const prochainDimanche = new Date(now);
  prochainDimanche.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
  const jourProchain = prochainDimanche.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Y a-t-il une pharmacie ouverte le dimanche ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui. Chaque dimanche, une pharmacie de garde est désignée dans chaque secteur pour assurer la permanence pharmaceutique. Elle est ouverte pour délivrer les médicaments urgents, sur ordonnance ou sans ordonnance. Pour la trouver, appelez le 3237 ou recherchez votre ville sur notre site.",
        },
      },
      {
        "@type": "Question",
        name: "Comment trouver une pharmacie ouverte dimanche ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Trois solutions : (1) appelez le 3237 (service de permanence des soins, disponible 24h/24, 0,35 €/min) ; (2) recherchez votre ville sur notre site ; (3) consultez l'affichage obligatoire sur la porte de votre pharmacie habituelle indiquant la pharmacie de garde du secteur.",
        },
      },
      {
        "@type": "Question",
        name: "Quels sont les horaires de la pharmacie ouverte le dimanche ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Les horaires varient selon les secteurs. Certaines pharmacies de garde sont ouvertes le matin uniquement (9h-12h), d'autres toute la journée ou 24h/24. Appelez la pharmacie de garde ou le 3237 pour confirmer les horaires exacts dans votre ville.",
        },
      },
      {
        "@type": "Question",
        name: "Peut-on avoir une ordonnance honorée le dimanche ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui. La pharmacie de garde du dimanche peut délivrer les médicaments prescrits sur ordonnance. En cas d'urgence sans ordonnance, certains médicaments peuvent être dispensés en dépannage. Pour une urgence médicale grave, appelez le 15 (SAMU).",
        },
      },
      {
        "@type": "Question",
        name: "La pharmacie de garde du dimanche est-elle aussi ouverte la nuit ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pas toujours. La permanence de nuit du dimanche peut être assurée par une pharmacie différente de celle de la journée. Appelez le 3237 pour connaître la pharmacie de garde de nuit dans votre secteur.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Pharmacie ouverte dimanche", item: `${SITE_URL}/pharmacie-ouverte-dimanche` },
    ],
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Header */}
      <div
        className="py-12 px-4"
        style={{ background: "linear-gradient(180deg, #14532d 0%, #166534 50%, #16a34a 100%)" }}
      >
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Pharmacie ouverte dimanche</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Pharmacie Ouverte Dimanche
          </h1>
          <p className="text-white/90 text-lg">
            {isThisDimanche
              ? "✅ Aujourd'hui c'est dimanche — trouvez la pharmacie de garde dans votre ville"
              : `Prochain dimanche : ${jourProchain}`}
          </p>
        </div>
      </div>

      {/* Bannière */}
      <div className="bg-red-600 py-2.5 px-4 flex items-center justify-center">
        <a href="tel:3237" className="text-white text-sm font-medium hover:underline">
          🚨 Dimanche : appelez le <strong>3237</strong> pour trouver la pharmacie ouverte
        </a>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

        {/* Alerte si c'est dimanche */}
        {isThisDimanche && (
          <div className="rounded-xl bg-green-50 border border-green-200 p-5 flex gap-3 items-start">
            <span className="text-2xl flex-shrink-0">✅</span>
            <div>
              <p className="font-bold text-green-900 mb-1">Aujourd&apos;hui c&apos;est dimanche</p>
              <p className="text-green-700 text-sm">
                Une pharmacie de garde est ouverte dans votre secteur. Sélectionnez votre ville ci-dessous ou appelez le <strong>3237</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Grille villes */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pharmacie ouverte dimanche par ville
          </h2>
          <p className="text-gray-600 mb-6">
            Sélectionnez votre ville pour voir les pharmacies de garde disponibles le dimanche.
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
              Y a-t-il une pharmacie ouverte le dimanche ?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Oui. En France, le service de <strong>pharmacie de garde du dimanche</strong> est organisé par le Conseil départemental de l&apos;Ordre des Pharmaciens. Chaque semaine, au moins une pharmacie par secteur est désignée pour assurer la permanence pharmaceutique le dimanche.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              La pharmacie ouverte le dimanche peut délivrer tous les médicaments : médicaments sur ordonnance urgents, médicaments sans ordonnance, dispositifs médicaux d&apos;urgence. En cas d&apos;urgence médicale grave, appelez le <strong>15</strong> (SAMU) plutôt que la pharmacie.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Comment trouver la pharmacie ouverte dimanche près de chez moi ?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              La méthode la plus rapide : appelez le <strong>3237</strong>. Ce numéro court vous redirige automatiquement vers le service de régulation pharmaceutique de votre département, qui vous communique les coordonnées exactes (adresse, téléphone, horaires) de la pharmacie de garde ouverte le dimanche la plus proche de vous.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Vous pouvez aussi : chercher votre ville dans la liste ci-dessus, lire l&apos;affichage obligatoire sur la porte de votre pharmacie habituelle, ou consulter le site de l&apos;Ordre des Pharmaciens de votre département.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Pharmacie ouverte dimanche matin : que faire ?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Certaines pharmacies de garde sont uniquement ouvertes <strong>le matin</strong> (généralement de 9h à 12h ou 9h à 14h). D&apos;autres assurent une permanence toute la journée. Pour connaître les horaires précis de la pharmacie de garde du dimanche dans votre ville, appelez directement la pharmacie ou le <strong>3237</strong> qui vous donnera l&apos;horaire d&apos;ouverture.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Questions fréquentes — pharmacie ouverte le dimanche
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

        {/* Liens utiles */}
        <section className="border-t border-gray-200 pt-8 flex flex-wrap gap-4">
          <Link href="/pharmacie-de-garde-aujourd-hui" className="text-sm text-green-700 font-medium hover:underline">
            → Pharmacie ouverte aujourd&apos;hui
          </Link>
          <Link href="/pharmacie-de-garde-nuit" className="text-sm text-green-700 font-medium hover:underline">
            → Pharmacie de garde de nuit
          </Link>
          <Link href="/3237-pharmacie-de-garde" className="text-sm text-green-700 font-medium hover:underline">
            → Tout savoir sur le 3237
          </Link>
          <Link href="/jours-feries" className="text-sm text-green-700 font-medium hover:underline">
            → Jours fériés
          </Link>
        </section>

      </div>
    </div>
  );
}
