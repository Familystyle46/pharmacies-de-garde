import Link from "next/link";

export interface VilleProche {
  ville: string;
  ville_slug: string;
}

interface VillesProchesProps {
  villes: VilleProche[];
}

export function VillesProches({ villes }: VillesProchesProps) {
  if (villes.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Villes proches</h2>
      <div className="flex flex-wrap gap-2">
        {villes.map((v) => (
          <Link
            key={v.ville_slug}
            href={`/pharmacie-de-garde/${v.ville_slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-primary hover:text-white hover:shadow-md"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {v.ville}
          </Link>
        ))}
      </div>
    </section>
  );
}
