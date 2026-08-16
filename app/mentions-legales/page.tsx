import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site pharmacies-de-garde.net : éditeur, hébergeur, propriété intellectuelle et responsabilité.",
  alternates: { canonical: "/mentions-legales" },
};

/** Champ à compléter par l'éditeur — visible pour éviter toute publication accidentelle incomplète. */
function ACompleter({ children }: { children: React.ReactNode }) {
  return (
    <mark className="bg-amber-100 text-amber-900 px-1 rounded">[À compléter : {children}]</mark>
  );
}

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Mentions légales</span>
      </nav>

      <h1 className="mb-8 text-3xl font-bold text-gray-900 font-serif">Mentions légales</h1>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Éditeur du site</h2>
          <p>
            Le site <strong>pharmacies-de-garde.net</strong> est édité par&nbsp;:
          </p>
          <ul className="mt-3 space-y-1">
            <li>Éditeur&nbsp;: <ACompleter>nom / raison sociale</ACompleter></li>
            <li>Statut&nbsp;: <ACompleter>ex. entreprise individuelle, SAS, auto-entrepreneur</ACompleter></li>
            <li>SIREN / SIRET&nbsp;: <ACompleter>numéro d&apos;immatriculation</ACompleter></li>
            <li>Adresse&nbsp;: <ACompleter>adresse postale du siège</ACompleter></li>
            <li>Contact&nbsp;: via notre <Link href="/contact" className="text-primary font-medium hover:text-primary-hover">formulaire de contact</Link></li>
            <li>Directeur de la publication&nbsp;: <ACompleter>nom du responsable</ACompleter></li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Hébergeur</h2>
          <p>
            Le site est hébergé par&nbsp;:
          </p>
          <ul className="mt-3 space-y-1">
            <li>Vercel Inc.</li>
            <li>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
            <li>
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover">vercel.com</a>
            </li>
          </ul>
          <p className="mt-2 text-sm text-gray-500">
            (Si votre hébergeur diffère, remplacez ces informations.)
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Propriété intellectuelle</h2>
          <p>
            La structure, les textes, la charte graphique et les éléments qui composent le site sont
            la propriété de l&apos;éditeur, sauf mention contraire. Les données cartographiques sont
            fournies par les contributeurs{" "}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover">
              OpenStreetMap
            </a>{" "}
            sous licence ODbL. Toute reproduction non autorisée du contenu original est interdite.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Responsabilité</h2>
          <p>
            Les informations diffusées sur pharmacies-de-garde.net sont fournies à titre indicatif et
            non contractuel. Malgré le soin apporté à leur mise à jour, elles peuvent comporter des
            inexactitudes. L&apos;éditeur ne saurait être tenu responsable d&apos;un préjudice lié à
            leur utilisation. Pour toute information officielle sur les pharmacies de garde, composez
            le <strong>3237</strong>. En cas d&apos;urgence, appelez le <strong>15</strong>.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Données personnelles &amp; cookies</h2>
          <p>
            Le traitement de vos données personnelles et l&apos;usage des cookies sont détaillés dans
            notre <Link href="/confidentialite" className="text-primary font-medium hover:text-primary-hover">politique de confidentialité</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
