import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité de pharmacies-de-garde.net : données collectées, cookies, mesure d'audience, publicité et vos droits (RGPD).",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Confidentialité</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold text-gray-900 font-serif">Politique de confidentialité</h1>
      <p className="mb-8 text-gray-600">
        Cette page explique quelles données nous traitons, pourquoi, et comment exercer vos droits.
      </p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Responsable du traitement</h2>
          <p>
            Les données sont traitées par l&apos;éditeur du site (voir{" "}
            <Link href="/mentions-legales" className="text-primary font-medium hover:text-primary-hover">mentions légales</Link>).
            Pour toute question relative à vos données, contactez-nous via le{" "}
            <Link href="/contact" className="text-primary font-medium hover:text-primary-hover">formulaire de contact</Link>.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Données que nous collectons</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <strong>Formulaire de contact</strong>&nbsp;: les informations que vous saisissez
              (nom, e-mail, message) sont utilisées uniquement pour répondre à votre demande. Elles
              sont transmises via notre prestataire d&apos;envoi d&apos;e-mails et ne sont pas
              revendues.
            </li>
            <li>
              <strong>Mesure d&apos;audience</strong>&nbsp;: nous utilisons Google Analytics pour
              comprendre l&apos;usage du site (pages vues, provenance) de façon agrégée.
            </li>
            <li>
              <strong>Publicité</strong>&nbsp;: nous affichons des annonces via Google AdSense, qui
              peut utiliser des cookies pour proposer des publicités pertinentes.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Cookies</h2>
          <p>
            Le site utilise des cookies de mesure d&apos;audience (Google Analytics) et de publicité
            (Google AdSense). Vous pouvez à tout moment configurer votre navigateur pour refuser les
            cookies. Pour en savoir plus sur l&apos;usage des données par Google, consultez la{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover">
              politique de confidentialité de Google
            </a>.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Durée de conservation</h2>
          <p>
            Les messages reçus via le formulaire de contact sont conservés le temps nécessaire au
            traitement de votre demande, puis archivés ou supprimés. Les données de mesure
            d&apos;audience sont conservées selon les paramètres de Google Analytics.
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Vos droits (RGPD)</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi
            « Informatique et Libertés », vous disposez d&apos;un droit d&apos;accès, de
            rectification, d&apos;effacement, de limitation et d&apos;opposition sur vos données.
          </p>
          <p className="mt-3">
            Pour exercer ces droits, écrivez-nous via le{" "}
            <Link href="/contact" className="text-primary font-medium hover:text-primary-hover">formulaire de contact</Link>.
            Vous pouvez également introduire une réclamation auprès de la{" "}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover">CNIL</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
