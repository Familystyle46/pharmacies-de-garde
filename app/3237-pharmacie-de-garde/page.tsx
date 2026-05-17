import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { AdUnit } from "@/components/AdUnit";
import { TOP_VILLES } from "@/lib/jours-feries";

const AD_SLOT_BOTTOM = "2611938233";
const SITE_URL = "https://pharmacies-de-garde.net";

export const metadata: Metadata = {
  title: "Le 3237 : Numéro Pharmacie de Garde | Comment ça marche ?",
  description:
    "Tout savoir sur le 3237, numéro national pour trouver une pharmacie de garde en France. Gratuit ou payant ? Disponible 24h/24 ? Toutes les réponses.",
  alternates: { canonical: `${SITE_URL}/3237-pharmacie-de-garde` },
  openGraph: {
    title: "Le 3237 : Numéro Pharmacie de Garde | Comment ça marche ?",
    description:
      "Tout savoir sur le 3237, numéro national pour trouver une pharmacie de garde en France.",
  },
};

const breadcrumbItems = [
  { name: "Accueil", href: "/" },
  { name: "Le 3237 — Pharmacie de garde", href: undefined },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Le 3237 est-il gratuit ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non, le 3237 est un service payant : il est facturé 0,35 € TTC par minute depuis un téléphone fixe ou mobile. La mise en relation avec la pharmacie de garde est en revanche rapide, généralement en moins d'une minute.",
      },
    },
    {
      "@type": "Question",
      name: "Le 3237 est-il disponible la nuit et le week-end ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, le 3237 est disponible 24h/24, 7j/7, y compris la nuit, le dimanche et les jours fériés. C'est précisément dans ces créneaux que ce service est le plus utile.",
      },
    },
    {
      "@type": "Question",
      name: "Comment fonctionne le 3237 pour trouver une pharmacie de garde ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En composant le 3237, vous êtes mis en relation avec le service de permanence des soins de votre département. Un opérateur ou un système vocal vous communique l'adresse et le téléphone de la pharmacie de garde la plus proche, selon votre localisation.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on trouver une pharmacie de garde sans appeler le 3237 ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Vous pouvez utiliser notre site pharmacies-de-garde.net en recherchant votre ville, ou consulter l'affichage obligatoire sur la porte de votre pharmacie habituelle. En cas d'urgence médicale, appelez directement le 15 (SAMU).",
      },
    },
    {
      "@type": "Question",
      name: "Le 3237 fonctionne-t-il depuis l'étranger ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non, le 3237 est un numéro court valable uniquement depuis la France métropolitaine et les DOM. Depuis l'étranger, consultez le site www.3237.fr ou notre annuaire en ligne.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle est la différence entre le 3237 et le 15 (SAMU) ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le 3237 vous oriente vers une pharmacie de garde pour obtenir des médicaments. Le 15 (SAMU) est le numéro d'urgence médicale pour les situations graves nécessitant une intervention médicale immédiate. Si votre état de santé est préoccupant, appelez le 15.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Le 3237 — Pharmacie de garde", item: `${SITE_URL}/3237-pharmacie-de-garde` },
  ],
};

export default function Page3237() {
  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-3xl mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Hero */}
      <div
        className="py-12 px-4"
        style={{ background: "linear-gradient(180deg, #14532d 0%, #166534 50%, #16a34a 100%)" }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Le <span className="underline decoration-white/50">3237</span> — Numéro national pharmacie de garde
          </h1>
          <p className="text-white/90 text-lg">
            Comment ça marche, est-ce gratuit, quand l&apos;appeler ? Tout ce qu&apos;il faut savoir.
          </p>
        </div>
      </div>

      {/* Bannière urgence */}
      <div className="bg-red-600 py-2.5 px-4 flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          🚨 Urgence médicale grave : <strong>15</strong> (SAMU) — Pharmacie de garde : <strong>3237</strong>
        </span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">

        {/* C'est quoi le 3237 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Qu&apos;est-ce que le 3237 ?</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Le <strong>3237</strong> est le numéro national de la <strong>permanence des soins</strong> en France. En composant ce numéro depuis votre téléphone fixe ou mobile, vous êtes automatiquement redirigé vers le service de régulation pharmaceutique de votre département, qui vous communique l&apos;adresse et le numéro de téléphone de la <strong>pharmacie de garde</strong> la plus proche de chez vous.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            Ce service est géré par les <strong>Unions Régionales des Professionnels de Santé (URPS)</strong> et le réseau <strong>Résogardes</strong> en partenariat avec les Conseils de l&apos;Ordre des Pharmaciens. Il couvre l&apos;ensemble du territoire français, 24 heures sur 24, tous les jours de l&apos;année.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Il ne faut pas confondre le 3237 avec le <strong>15 (SAMU)</strong>, qui est le numéro d&apos;urgence médicale pour les situations graves. Le 3237 vous oriente vers des médicaments ; le 15 envoie des secours médicaux.
          </p>
        </section>

        {/* Tarif */}
        <section className="rounded-xl bg-amber-50 border border-amber-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">💰 Le 3237 est-il gratuit ?</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            <strong>Non, le 3237 est un service payant.</strong> Son tarif officiel est de <strong>0,35 € TTC par minute</strong> depuis un fixe ou un mobile, hors éventuels surcoûts de votre opérateur. Le coût moyen d&apos;un appel est inférieur à 1 € dans la plupart des cas, la mise en relation étant rapide.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>Alternative gratuite :</strong> utilisez notre site pour rechercher directement une pharmacie de garde par ville — sans appel téléphonique et sans frais.
          </p>
        </section>

        {/* Comment ça marche */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Comment fonctionne le 3237 ?</h2>
          <ol className="space-y-4">
            {[
              { n: "1", titre: "Composez le 3237", desc: "Depuis votre téléphone fixe ou mobile, en France métropolitaine ou dans les DOM." },
              { n: "2", titre: "Indiquez votre localisation", desc: "Un serveur vocal ou un opérateur vous demande votre commune ou votre code postal pour identifier le secteur de garde." },
              { n: "3", titre: "Obtenez les coordonnées", desc: "Le service vous communique le nom, l'adresse et le téléphone de la pharmacie de garde la plus proche, ouverte à cet instant." },
              { n: "4", titre: "Appelez la pharmacie (optionnel)", desc: "Certaines pharmacies de garde n'ouvrent que sur rendez-vous ou avec un code. Il est conseillé d'appeler avant de vous déplacer." },
            ].map(({ n, titre, desc }) => (
              <li key={n} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
                  {n}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{titre}</p>
                  <p className="text-gray-600 text-sm mt-1">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Quand appeler */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quand utiliser le 3237 ?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Le 3237 est particulièrement utile dans les situations suivantes :
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { emoji: "🌙", label: "La nuit", desc: "Entre 20h et 8h, quand toutes les pharmacies habituelles sont fermées." },
              { emoji: "📅", label: "Le dimanche", desc: "Un seul pharmacien de garde assure la permanence dans chaque secteur le dimanche." },
              { emoji: "🎆", label: "Les jours fériés", desc: "1er mai, 14 juillet, Noël, Ascension… les 11 jours fériés nationaux." },
              { emoji: "🏖️", label: "En vacances", desc: "Dans une ville inconnue, le 3237 vous oriente sans que vous ayez à chercher." },
            ].map(({ emoji, label, desc }) => (
              <div key={label} className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{label}</p>
                  <p className="text-gray-600 text-xs mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Alternatives */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Alternatives au 3237</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Si vous préférez ne pas appeler le 3237 (coût, indisponibilité téléphonique, etc.), plusieurs alternatives existent :
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-0.5">→</span>
              <div>
                <strong className="text-gray-900">Notre site pharmacies-de-garde.net</strong>
                <p className="text-gray-600 text-sm mt-1">
                  Recherchez votre ville ci-dessous pour voir immédiatement la liste des pharmacies de garde, avec adresses, horaires et cartes.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-0.5">→</span>
              <div>
                <strong className="text-gray-900">www.3237.fr</strong>
                <p className="text-gray-600 text-sm mt-1">
                  Le site officiel du service 3237, géré par les syndicats de pharmaciens.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-0.5">→</span>
              <div>
                <strong className="text-gray-900">L&apos;affichage en pharmacie</strong>
                <p className="text-gray-600 text-sm mt-1">
                  Toute pharmacie fermée est légalement obligée d&apos;afficher le nom et l&apos;adresse de la pharmacie de garde la plus proche.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-0.5">→</span>
              <div>
                <strong className="text-gray-900">La gendarmerie ou la police</strong>
                <p className="text-gray-600 text-sm mt-1">
                  En zone rurale, les forces de l&apos;ordre peuvent vous indiquer la pharmacie de garde de votre secteur.
                </p>
              </div>
            </li>
          </ul>
        </section>

        {/* Numéros urgence */}
        <section className="rounded-xl bg-red-50 border border-red-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">🚨 Numéros d&apos;urgence à connaître</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { num: "15", label: "SAMU", color: "bg-red-600" },
              { num: "18", label: "Pompiers", color: "bg-orange-600" },
              { num: "17", label: "Police", color: "bg-blue-600" },
              { num: "3237", label: "Pharmacie garde", color: "bg-green-600" },
            ].map(({ num, label, color }) => (
              <a key={num} href={`tel:${num}`} className="flex flex-col items-center rounded-lg bg-white border border-gray-200 p-3 hover:shadow-md transition-shadow text-center">
                <span className={`text-xl font-extrabold text-white ${color} rounded-lg px-3 py-1 mb-1`}>{num}</span>
                <span className="text-xs text-gray-600">{label}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Recherche par ville */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Trouver une pharmacie de garde sans appeler</h2>
          <p className="text-gray-600 text-sm mb-5">
            Sélectionnez votre ville pour accéder directement à la liste des pharmacies de garde disponibles.
          </p>
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

        <AdUnit slot={AD_SLOT_BOTTOM} format="horizontal" className="my-4" style={{ minHeight: 90 }} />

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions fréquentes sur le 3237</h2>
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

        <div className="mt-6">
          <Link href="/" className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-hover transition-colors">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
