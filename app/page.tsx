import Link from "next/link";
import { getVilles } from "@/lib/pharmacies";
import { SearchBar } from "@/components/SearchBar";
import { DEPARTEMENTS, TOP_20_DEPARTEMENTS } from "@/lib/departements";

const VILLES_FALLBACK: { slug: string; nom: string; departement: string; count: number }[] = [
  { slug: "paris", nom: "Paris", departement: "75", count: 0 },
  { slug: "marseille", nom: "Marseille", departement: "13", count: 0 },
  { slug: "lyon", nom: "Lyon", departement: "69", count: 0 },
  { slug: "toulouse", nom: "Toulouse", departement: "31", count: 0 },
  { slug: "nice", nom: "Nice", departement: "06", count: 0 },
  { slug: "nantes", nom: "Nantes", departement: "44", count: 0 },
  { slug: "montpellier", nom: "Montpellier", departement: "34", count: 0 },
  { slug: "strasbourg", nom: "Strasbourg", departement: "67", count: 0 },
  { slug: "bordeaux", nom: "Bordeaux", departement: "33", count: 0 },
  { slug: "lille", nom: "Lille", departement: "59", count: 0 },
  { slug: "rennes", nom: "Rennes", departement: "35", count: 0 },
  { slug: "reims", nom: "Reims", departement: "51", count: 0 },
  { slug: "saint-etienne", nom: "Saint-Étienne", departement: "42", count: 0 },
  { slug: "toulon", nom: "Toulon", departement: "83", count: 0 },
  { slug: "le-havre", nom: "Le Havre", departement: "76", count: 0 },
  { slug: "grenoble", nom: "Grenoble", departement: "38", count: 0 },
  { slug: "dijon", nom: "Dijon", departement: "21", count: 0 },
  { slug: "angers", nom: "Angers", departement: "49", count: 0 },
  { slug: "nimes", nom: "Nîmes", departement: "30", count: 0 },
  { slug: "villeurbanne", nom: "Villeurbanne", departement: "69", count: 0 },
];

const ETAPES = [
  {
    titre: "Rechercher",
    desc: "Indiquez votre ville ou code postal pour trouver les pharmacies de garde à proximité.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    titre: "Localiser",
    desc: "Consultez la carte et la liste pour identifier la pharmacie la plus proche de chez vous.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    titre: "Contacter",
    desc: "Appelez la pharmacie pour confirmer les horaires ou composez le 3237 pour être mis en relation.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
];

export default async function HomePage() {
  let villes = await getVilles();
  if (villes.length === 0) villes = VILLES_FALLBACK;
  const topVilles = villes.slice(0, 20);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden text-center py-20 md:py-28 px-4"
        style={{
          background: "linear-gradient(180deg, #14532d 0%, #166534 50%, #16a34a 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          {/* Icône croix verte */}
          <div className="mb-6 flex justify-center">
            <svg
              className="w-16 h-16 text-white drop-shadow-lg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
            Trouvez votre pharmacie de garde
          </h1>
          <p className="text-white/90 text-lg mb-10 max-w-lg mx-auto">
            Recherchez par ville ou code postal. Disponible la nuit, le dimanche et les jours fériés.
          </p>
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Bannière 3237 */}
      <div className="bg-red-600 py-3 px-6 flex items-center justify-center gap-3 flex-wrap">
        <span className="text-white text-sm font-medium">
          🚨 Urgence ? Appelez le <strong>3237</strong> — Disponible 24h/24, 7j/7
        </span>
      </div>

      {/* Grille 20 villes */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Villes les plus recherchées
        </h2>
        <p className="text-gray-600 mb-8">
          Accès rapide aux pharmacies de garde dans les grandes villes
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {topVilles.map((ville) => (
            <Link
              key={ville.slug}
              href={`/pharmacie-de-garde/${ville.slug}`}
              className="group flex items-center gap-3 rounded-xl bg-white p-4 shadow-md border border-gray-100 transition-all hover:border-primary hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors block truncate">
                  {ville.nom}
                </span>
                <span className="text-xs text-gray-500">{ville.departement}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Grille départements */}
      <section className="max-w-6xl mx-auto py-16 px-4 border-t border-gray-200 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Par département
        </h2>
        <p className="text-gray-600 mb-8">
          Accès aux pharmacies de garde par département
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {DEPARTEMENTS.filter((d) => TOP_20_DEPARTEMENTS.includes(d.code)).map((d) => (
            <Link
              key={d.code}
              href={`/departement/${d.code}`}
              className="group flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm border border-gray-100 transition-all hover:border-primary hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-sm font-medium text-gray-500 group-hover:text-primary transition-colors">
                {d.code}
              </span>
              <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                {d.nom}
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-sm text-gray-500">
          Les 20 départements les plus peuplés
        </p>
      </section>

      {/* Comment ça marche */}
      <section className="bg-gray-50 py-16 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {ETAPES.map((etape, i) => (
              <div
                key={etape.titre}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm border border-gray-100"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {etape.icon}
                </div>
                <span className="text-sm font-semibold text-primary mb-2">Étape {i + 1}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{etape.titre}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{etape.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
