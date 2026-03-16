"use client";

import {
  isOpenNow,
  expandToDailySchedule,
  HORAIRES_INDISPONIBLES,
} from "@/utils/formatHoraires";

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
  const openNow = showOpenNow ? isOpenNow(horaires) : null;
  const schedule = expandToDailySchedule(horaires);

  const currentDayCode = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][
    new Date().getDay()
  ];

  if (!schedule) {
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
    <div className={`space-y-2 ${className}`}>
      {/* Badge Ouvert / Fermé */}
      {showOpenNow && openNow !== null && (
        <div>
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

      {/* Planning 7 jours */}
      <ul className="text-sm space-y-0.5">
        {schedule.map(({ dayCode, dayFr, hours }) => {
          const isToday = dayCode === currentDayCode;
          return (
            <li
              key={dayCode}
              className={`flex justify-between gap-3 rounded px-1.5 py-0.5 ${
                isToday ? "bg-green-50 font-semibold" : ""
              }`}
            >
              <span
                className={isToday ? "text-green-800" : "text-gray-700"}
              >
                {dayFr}
              </span>
              {hours ? (
                <span
                  className={`text-right ${
                    isToday ? "text-green-800" : "text-gray-500"
                  }`}
                >
                  {hours}
                </span>
              ) : (
                <span className="text-red-500 font-medium">Fermé</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
