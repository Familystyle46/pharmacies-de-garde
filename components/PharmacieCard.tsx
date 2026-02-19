import Link from "next/link";
import type { Pharmacie } from "@/lib/pharmacies";
import { HorairesDisplay } from "@/components/HorairesDisplay";

interface PharmacieCardProps {
  pharmacie: Pharmacie;
  /** Si fournis, le nom devient un lien vers la page pharmacie */
  villeSlug?: string;
  pharmacieSlug?: string;
}

function mapsUrl(pharmacie: Pharmacie): string {
  const addr = encodeURIComponent(
    `${pharmacie.adresse}, ${pharmacie.code_postal} ${pharmacie.ville}`
  );
  return `https://www.google.com/maps/search/?api=1&query=${addr}`;
}

export function PharmacieCard({ pharmacie, villeSlug, pharmacieSlug }: PharmacieCardProps) {
  const tel = pharmacie.telephone?.replace(/\s/g, "") ?? "";
  const hasHoraires = Boolean(pharmacie.horaires?.trim());
  const hasLink = Boolean(villeSlug && pharmacieSlug);
  const showOpenNow = true;

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-primary hover:shadow-md">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 mb-2">
            {hasLink ? (
              <Link
                href={`/pharmacie-de-garde/${villeSlug}/${pharmacieSlug}`}
                className="hover:text-primary hover:underline"
              >
                {pharmacie.nom}
              </Link>
            ) : (
              pharmacie.nom
            )}
          </h3>
          <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
            <svg
              className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400"
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
            </svg>
            <span>
              {pharmacie.adresse}, {pharmacie.code_postal} {pharmacie.ville}
            </span>
          </div>
          {hasHoraires && (
            <HorairesDisplay horaires={pharmacie.horaires} showOpenNow={showOpenNow} className="mt-2" />
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
        {pharmacie.telephone && (
          <a
            href={`tel:${tel}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {pharmacie.telephone}
          </a>
        )}
        <a
          href={mapsUrl(pharmacie)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border-2 border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-primary hover:text-primary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          Itinéraire
        </a>
      </div>
    </article>
  );
}
