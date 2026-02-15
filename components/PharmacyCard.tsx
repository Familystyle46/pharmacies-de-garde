import type { Pharmacie } from "@/lib/pharmacies";

interface PharmacyCardProps {
  pharmacie: Pharmacie;
}

function mapsUrl(pharmacie: Pharmacie): string {
  const addr = encodeURIComponent(`${pharmacie.adresse}, ${pharmacie.code_postal} ${pharmacie.ville}`);
  return `https://www.google.com/maps/search/?api=1&query=${addr}`;
}

export function PharmacyCard({ pharmacie }: PharmacyCardProps) {
  const tel = pharmacie.telephone?.replace(/\s/g, "") ?? "";
  return (
    <article className="rounded-[14px] border-2 border-gray-200 bg-white p-4 mb-3 transition-all hover:border-primary">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-900 mb-1">{pharmacie.nom}</h3>
          <div className="text-[13px] text-gray-500 mb-1.5">
            📍 {pharmacie.adresse}, {pharmacie.code_postal} {pharmacie.ville}
          </div>
          {pharmacie.horaires && (
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>🕐 {pharmacie.horaires}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        {pharmacie.telephone && (
          <a
            href={`tel:${tel}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-white text-[13px] font-semibold no-underline"
          >
            📞 {pharmacie.telephone}
          </a>
        )}
        <a
          href={mapsUrl(pharmacie)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-3.5 py-2 rounded-lg border-[1.5px] border-gray-300 bg-white text-[13px] font-medium text-gray-700 no-underline"
        >
          🗺️ Itinéraire
        </a>
      </div>
    </article>
  );
}
