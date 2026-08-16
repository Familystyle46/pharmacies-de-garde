/**
 * Indicateur de fraîcheur des données (signal E-E-A-T pour les sujets santé/YMYL).
 * Rendu côté serveur : la date correspond au dernier build / à la dernière
 * revalidation de la page (les pages de garde revalident toutes les 24 h).
 */
export function DerniereMaj({ className = "" }: { className?: string }) {
  const maintenant = new Date();
  const date = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(maintenant);

  return (
    <p
      className={`flex items-center gap-1.5 text-xs text-gray-500 ${className}`}
      suppressHydrationWarning
    >
      <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>
        Données vérifiées quotidiennement — dernière mise à jour le{" "}
        <time dateTime={maintenant.toISOString().slice(0, 10)} className="font-medium text-gray-700">
          {date}
        </time>
      </span>
    </p>
  );
}
