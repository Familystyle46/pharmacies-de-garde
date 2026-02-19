/**
 * Parse le format horaires OpenStreetMap et convertit en lignes lisibles en français.
 * Format OSM : Mo-Sa 09:00-12:30,14:00-19:00; Su off
 */

const JOURS_OSM_TO_FR: Record<string, string> = {
  Mo: "Lun",
  Tu: "Mar",
  We: "Mer",
  Th: "Jeu",
  Fr: "Ven",
  Sa: "Sam",
  Su: "Dim",
};

const JOURS_ORDER = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function formatHeure(h: string): string {
  const trimmed = h.trim();
  if (!trimmed) return trimmed;
  return trimmed.replace(/^(\d{1,2}):(\d{2})$/, "$1h$2");
}

function formatPlageHeures(plage: string): string {
  const parts = plage.split("-").map((p) => p.trim());
  if (parts.length !== 2) return plage;
  return `${formatHeure(parts[0])}-${formatHeure(parts[1])}`;
}

function joursOsmToFr(joursOsm: string): string {
  const s = joursOsm.trim();
  if (!s) return "";

  if (s.includes("-")) {
    const [start, end] = s.split("-").map((x) => x.trim());
    const startFr = JOURS_OSM_TO_FR[start] ?? start;
    const endFr = JOURS_OSM_TO_FR[end] ?? end;
    return `${startFr}-${endFr}`;
  }

  if (s.includes(",")) {
    return s
      .split(",")
      .map((d) => JOURS_OSM_TO_FR[d.trim()] ?? d.trim())
      .join(", ");
  }

  return JOURS_OSM_TO_FR[s] ?? s;
}

function parseRule(rule: string): string {
  const r = rule.trim();
  if (!r) return "";

  const lower = r.toLowerCase();
  if (lower === "off" || lower === "closed") return "Fermé";
  if (lower === "24/7") return "Ouvert 24h/24, 7j/7";

  const parts = r.split(/\s+/);
  if (parts.length === 0) return "";

  const first = parts[0];
  const isDayToken = /^(Mo|Tu|We|Th|Fr|Sa|Su)(-(Mo|Tu|We|Th|Fr|Sa|Su))?$/.test(first) ||
    /^((Mo|Tu|We|Th|Fr|Sa|Su),?)+$/.test(first);

  if (!isDayToken) {
    if (lower === "off") return "Fermé";
    return r;
  }

  const joursPart = parts[0];
  const rest = parts.slice(1).join(" ").trim();

  const joursFr = joursOsmToFr(joursPart);
  if (!rest || rest.toLowerCase() === "off") {
    return `${joursFr} : Fermé`;
  }

  const timeParts = rest.split(",").map((t) => t.trim()).filter(Boolean);
  const heuresFormatees = timeParts.map((t) => formatPlageHeures(t)).join(" et ");
  return `${joursFr} : ${heuresFormatees}`;
}

/**
 * Convertit une chaîne horaires OSM en tableau de lignes en français.
 */
export function formatHoraires(horaires: string | null | undefined): string[] {
  if (horaires == null || String(horaires).trim() === "") {
    return [];
  }

  const s = String(horaires).trim();
  const lower = s.toLowerCase();
  if (lower === "24/7") {
    return ["Ouvert 24h/24, 7j/7"];
  }

  const rules = s.split(";").map((r) => r.trim()).filter(Boolean);
  const result: string[] = [];

  for (const rule of rules) {
    const formatted = parseRule(rule);
    if (formatted) result.push(formatted);
  }

  return result.length > 0 ? result : [];
}

/**
 * Texte par défaut quand pas d'horaires.
 */
export const HORAIRES_INDISPONIBLES = "Horaires non disponibles";

/**
 * Retourne true si la chaîne OSM indique que l'établissement est ouvert à l'instant actuel.
 * Simplification : on ne parse pas finement les plages, on vérifie 24/7 et "off".
 */
export function isOpenNow(horaires: string | null | undefined): boolean | null {
  if (horaires == null || String(horaires).trim() === "") return null;

  const s = String(horaires).trim().toLowerCase();
  if (s === "24/7") return true;

  const rules = s.split(";").map((r) => r.trim()).filter(Boolean);
  const now = new Date();
  const currentDay = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const rule of rules) {
    const parts = rule.split(/\s+/);
    if (parts.length === 0) continue;

    const dayPart = parts[0];
    const rest = parts.slice(1).join(" ").trim().toLowerCase();

    if (rest === "off" || rest === "closed") {
      if (dayMatchesCurrent(dayPart, currentDay)) return false;
      continue;
    }

    if (!dayMatchesCurrent(dayPart, currentDay)) continue;

    if (!rest || rest === "24/7") return true;

    const ranges = rest.split(",").map((x) => x.trim()).filter(Boolean);
    for (const range of ranges) {
      const [start, end] = range.split("-").map((x) => x.trim());
      if (!start || !end) continue;
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      const startMin = (sh ?? 0) * 60 + (sm ?? 0);
      let endMin = (eh ?? 0) * 60 + (em ?? 0);
      if (endMin < startMin) endMin += 24 * 60;
      if (currentMinutes >= startMin && currentMinutes <= endMin) return true;
    }
  }

  return false;
}

function dayMatchesCurrent(dayPart: string, currentDay: string): boolean {
  const d = dayPart.trim();
  if (d === currentDay) return true;
  if (d.includes("-")) {
    const [start, end] = d.split("-").map((x) => x.trim());
    const iStart = JOURS_ORDER.indexOf(start);
    const iEnd = JOURS_ORDER.indexOf(end);
    const iCurrent = JOURS_ORDER.indexOf(currentDay);
    if (iStart === -1 || iEnd === -1 || iCurrent === -1) return false;
    if (iStart <= iEnd) return iCurrent >= iStart && iCurrent <= iEnd;
    return iCurrent >= iStart || iCurrent <= iEnd;
  }
  if (d.includes(",")) {
    return d.split(",").map((x) => x.trim()).indexOf(currentDay) !== -1;
  }
  return false;
}
