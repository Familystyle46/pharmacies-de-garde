"use client";

import { formatHoraires, isOpenNow, HORAIRES_INDISPONIBLES } from "@/utils/formatHoraires";

interface HorairesDisplayProps {
  horaires: string | null | undefined;
  /** Afficher le badge Ouvert/Fermé maintenant */
  showOpenNow?: boolean;
  /** Nom de la pharmacie (pour accessibilité) */
  className?: string;
}

export function HorairesDisplay({
  horaires,
  showOpenNow = false,
  className = "",
}: HorairesDisplayProps) {
  const lines = formatHoraires(horaires);
  const openNow = showOpenNow ? isOpenNow(horaires) : null;

  if (lines.length === 0) {
    return (
      <p className={`text-sm text-gray-500 ${className}`}>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden>🕐</span>
          {HORAIRES_INDISPONIBLES}
        </span>
      </p>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {showOpenNow && openNow !== null && (
        <div className="mb-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              openNow
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                openNow ? "bg-green-600 animate-pulse" : "bg-red-600"
              }`}
            />
            {openNow ? "Ouvert" : "Fermé"}
          </span>
        </div>
      )}
      <div className="flex items-start gap-1.5 text-sm text-gray-600">
        <span aria-hidden className="flex-shrink-0 mt-0.5 text-gray-400">
          🕐
        </span>
        <ul className="list-none p-0 m-0 space-y-0.5">
          {lines.map((line, i) => (
            <li key={i}>
              {line.includes("Fermé") ? (
                <span className="text-red-600 font-medium">{line}</span>
              ) : (
                <span>{line}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
