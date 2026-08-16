import type { Metadata } from "next";
import Link from "next/link";
import { DerniereMaj } from "@/components/DerniereMaj";

export const metadata: Metadata = {
  title: "À propos — Qui sommes-nous ?",
  description:
    "pharmacies-de-garde.net : notre mission, l'origine de nos données (OpenStreetMap) et notre méthode pour vous aider à trouver une pharmacie de garde en France.",
  alternates: { canonical: "/a-propos" },
};

export default function AProposPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">À propos</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold text-gray-900 font-serif">À propos de pharmacies-de-garde.net</h1>
      <DerniereMaj className="mb-8" />

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Notre mission</h2>
          <p>
            Quand une urgence survient la nuit, un dimanche ou un jour férié, trouver
            rapidement une pharmacie ouverte peut devenir compliqué. <strong>pharmacies-de-garde.net</strong> a
            été créé pour répondre à ce besoin simple : vous aider à localiser en quelques secondes
            la pharmacie de garde la plus proche de chez vous, partout en France, avec son adresse,
            son téléphone et un itinéraire.
          </p>
          <p className="mt-3">
            Notre service est <strong>gratuit</strong> et accessible sans inscription. Il recense plus de
            20 000 pharmacies réparties dans toutes les communes et départements français.
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">D&apos;où viennent nos données&nbsp;?</h2>
          <p>
            Les informations sur les pharmacies (nom, adresse, coordonnées, position sur la carte)
            proviennent de la base de données ouverte{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:text-primary-hover"
            >
              OpenStreetMap
            </a>{" "}
            (licence ODbL), enrichies et vérifiées régulièrement par notre équipe.
          </p>
          <p className="mt-3">
            Pour la <strong>garde en temps réel</strong> (quelle pharmacie est officiellement de garde
            aujourd&apos;hui), la source de référence reste le <strong>3237</strong>, le service officiel
            des pharmaciens. Nous détaillons entièrement notre méthode sur la page{" "}
            <Link href="/sources" className="text-primary font-medium hover:text-primary-hover">
              Sources &amp; méthodologie
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Un service indépendant</h2>
          <p>
            pharmacies-de-garde.net est un <strong>service d&apos;information privé et indépendant</strong>.
            Il n&apos;est ni géré ni affilié aux services officiels de l&apos;État, à l&apos;Ordre national
            des pharmaciens ou à une Agence Régionale de Santé (ARS). Les informations sont fournies à
            titre indicatif&nbsp;: en cas d&apos;urgence, appelez le <strong>15 (SAMU)</strong> ou
            le <strong>3237</strong>.
          </p>
        </section>

        <section className="rounded-xl bg-primary/5 border border-primary/20 p-6">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Une erreur à signaler&nbsp;?</h2>
          <p className="text-gray-700">
            Une pharmacie a fermé, changé d&apos;adresse ou de numéro&nbsp;? Aidez-nous à améliorer la
            qualité des données&nbsp;: <Link href="/contact" className="text-primary font-medium hover:text-primary-hover">contactez-nous</Link>.
            Chaque signalement est vérifié et corrigé.
          </p>
        </section>
      </div>
    </div>
  );
}
