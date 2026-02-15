import Link from "next/link";
import { getVilles } from "@/lib/pharmacies";
import { SearchBar } from "@/components/SearchBar";

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
];

export default async function HomePage() {
  let villes = await getVilles();
  if (villes.length === 0) villes = VILLES_FALLBACK;
  const topVilles = villes.slice(0, 10);

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div>
      {/* Hero */}
      <div
        className="relative overflow-hidden text-center"
        style={{
          background: "linear-gradient(135deg, #14532d 0%, #166534 40%, #15803d 100%)",
          padding: "60px 24px 80px",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)",
          }}
        />
        <div className="relative">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-1.5 text-white/90 text-sm mb-5"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <span
              className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot"
            />
            Service actif — {today}
          </div>
          <h1
            className="text-white font-extrabold leading-tight mb-3 mx-auto max-w-lg font-serif"
            style={{ fontSize: "clamp(26px, 5vw, 42px)" }}
          >
            Trouvez une pharmacie
            <br />
            de garde près de chez vous
          </h1>
          <p className="text-white/75 text-base mb-9 max-w-md mx-auto">
            Ouverte la nuit, le dimanche et les jours fériés
          </p>
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Bannière 3237 */}
      <div
        className="flex items-center justify-center gap-3 flex-wrap py-3 px-6"
        style={{
          background: "#fff7ed",
          borderTop: "1px solid #fed7aa",
          borderBottom: "1px solid #fed7aa",
        }}
      >
        <span className="text-xl">🚨</span>
        <span className="text-sm text-amber-800 font-medium">
          Urgence ? Appelez le <strong className="text-amber-700">3237</strong> — Disponible 24h/24, 7j/7, partout en France
        </span>
      </div>

      {/* Villes populaires */}
      <div className="max-w-[960px] mx-auto py-12 px-6">
        <h2 className="text-[22px] font-bold text-gray-900 mb-2">
          Villes les plus recherchées
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Accès rapide aux pharmacies de garde dans les grandes villes
        </p>
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
        >
          {topVilles.map((ville) => (
            <Link
              key={ville.slug}
              href={`/pharmacie-de-garde/${ville.slug}`}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-sm font-semibold text-gray-700 transition-all hover:border-primary hover:text-primary"
            >
              <span>📍 {ville.nom}</span>
              <span className="text-[11px] text-gray-400 font-normal">
                {ville.departement}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Infos */}
      <div
        className="border-t border-gray-200 py-12 px-6"
        style={{ background: "#f9fafb" }}
      >
        <div
          className="max-w-[960px] mx-auto grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
        >
          {[
            { icon: "🌙", title: "Ouverte la nuit", desc: "Accès garanti aux médicaments urgents, même entre minuit et 6h" },
            { icon: "📅", title: "Dimanche & Jours fériés", desc: "Chaque officine participe à tour de rôle aux gardes hebdomadaires" },
            { icon: "💊", title: "Sans ordonnance", desc: "De nombreux médicaments disponibles sans prescription en pharmacie de garde" },
          ].map((item) => (
            <div key={item.title} className="flex gap-3.5">
              <div className="text-2xl flex-shrink-0">{item.icon}</div>
              <div>
                <div className="font-bold text-gray-900 mb-1">{item.title}</div>
                <div className="text-gray-500 text-[13px] leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
