import type { Metadata } from "next";
import Link from "next/link";
import { DerniereMaj } from "@/components/DerniereMaj";

export const metadata: Metadata = {
  title: "Sources & méthodologie des données",
  description:
    "Comment nous collectons, vérifions et mettons à jour les données des pharmacies de garde : sources officielles (3237, ARS, Ordre des pharmaciens) et OpenStreetMap.",
  alternates: { canonical: "/sources" },
};

const SOURCES = [
  {
    nom: "3237 — Service officiel des pharmacies de garde",
    desc: "Service audiotel officiel (0,35 €/min) et référence nationale pour connaître la pharmacie de garde en temps réel, 24h/24.",
    url: "https://www.3237.fr",
    label: "3237.fr",
  },
  {
    nom: "Ordre national des pharmaciens",
    desc: "Institution officielle qui recense l'ensemble des pharmacies d'officine autorisées en France.",
    url: "https://www.ordre.pharmacien.fr",
    label: "ordre.pharmacien.fr",
  },
  {
    nom: "Agences Régionales de Santé (ARS)",
    desc: "Les ARS organisent et publient les tours de garde des pharmacies au niveau départemental.",
    url: "https://www.ars.sante.fr",
    label: "ars.sante.fr",
  },
  {
    nom: "OpenStreetMap",
    desc: "Base cartographique ouverte (licence ODbL) dont proviennent les coordonnées, adresses et positions des pharmacies affichées sur nos cartes.",
    url: "https://www.openstreetmap.org/copyright",
    label: "openstreetmap.org",
  },
  {
    nom: "Ameli — Annuaire santé",
    desc: "Annuaire officiel de l'Assurance Maladie pour retrouver les professionnels et établissements de santé.",
    url: "https://annuairesante.ameli.fr",
    label: "annuairesante.ameli.fr",
  },
];

export default function SourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Sources &amp; méthodologie</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold text-gray-900 font-serif">Sources &amp; méthodologie</h1>
      <p className="mb-4 text-gray-600">
        La transparence sur l&apos;origine et la fiabilité de nos informations est une priorité,
        particulièrement s&apos;agissant d&apos;un sujet de santé.
      </p>
      <DerniereMaj className="mb-8" />

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Comment nous collectons les données</h2>
          <p>
            Notre base recense plus de 20 000 pharmacies françaises. Les données de localisation
            (nom, adresse, code postal, coordonnées GPS, téléphone) sont issues de la base
            collaborative <strong>OpenStreetMap</strong>, reconnue pour sa richesse et sa mise à jour
            permanente par une large communauté. Nous les nettoyons, normalisons et enrichissons avant
            publication.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Comment nous vérifions et mettons à jour</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>Les données sont <strong>revalidées automatiquement chaque jour</strong> pour refléter les dernières informations disponibles.</li>
            <li>Les signalements d&apos;erreurs reçus via notre <Link href="/contact" className="text-primary font-medium hover:text-primary-hover">formulaire de contact</Link> sont traités et corrigés manuellement.</li>
            <li>Les coordonnées géographiques sont converties depuis les systèmes officiels (Lambert 93) vers le standard mondial WGS84 pour un affichage cartographique précis.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="mb-2 text-lg font-semibold text-amber-900">Information importante</h2>
          <p className="text-amber-800">
            Les tours de garde peuvent changer à la dernière minute. Pour connaître avec certitude la
            pharmacie <strong>officiellement de garde</strong> à un instant donné, composez le{" "}
            <a href="tel:3237" className="font-bold underline">3237</a> (service officiel) ou, en cas
            d&apos;urgence vitale, le <strong>15 (SAMU)</strong>. Les informations de ce site sont
            fournies à titre indicatif et non contractuel.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Nos sources officielles de référence</h2>
          <div className="space-y-4">
            {SOURCES.map((s) => (
              <div key={s.url} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900">{s.nom}</h3>
                <p className="mt-1 text-sm text-gray-600">{s.desc}</p>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-primary font-medium hover:text-primary-hover"
                >
                  {s.label}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-gray-200 pt-6 text-sm text-gray-500">
          <p>
            Données cartographiques © les contributeurs{" "}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover">
              OpenStreetMap
            </a>, sous licence ODbL. En savoir plus sur notre{" "}
            <Link href="/a-propos" className="text-primary hover:text-primary-hover">équipe et notre mission</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
