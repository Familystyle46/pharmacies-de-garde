/**
 * Parse les horaires en format OSM ou Google Places et convertit en français.
 * Format OSM    : Mo-Sa 09:00-12:30,14:00-19:00; Su off
 * Format Google : Monday: 8:30 AM – 12:30 PM, 2:30 – 7:00 PM | Tuesday: ...
 */

// ─── Conversion format Google → OSM ────────────────────────────────────────

const GOOGLE_DAY_TO_OSM: Record<string, string> = {
  monday: "Mo",
  tuesday: "Tu",
  wednesday: "We",
  thursday: "Th",
  friday: "Fr",
  saturday: "Sa",
  sunday: "Su",
};

function isGoogleFormat(s: string): boolean {
  return /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s*:/i.test(s.trim());
}

function parseAmPmTime(t: string): string {
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) {
    // Peut être juste "2:30" sans AM/PM (continuation d'une plage)
    const bare = t.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (bare) return t.trim();
    return t.trim();
  }
  let h = parseInt(m[1]);
  const min = m[2];
  const period = m[3].toUpperCase();
  if (period === "AM") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }
  return `${String(h).padStart(2, "0")}:${min}`;
}

function convertGoogleToOsm(googleStr: string): string {
  const parts = googleStr.split(" | ");
  const rules: string[] = [];

  for (const part of parts) {
    const colonIdx = part.indexOf(": ");
    if (colonIdx === -1) continue;
    const dayName = part.slice(0, colonIdx).trim().toLowerCase();
    const osmDay = GOOGLE_DAY_TO_OSM[dayName];
    if (!osmDay) continue;
    const hoursStr = part.slice(colonIdx + 2).trim();
    if (!hoursStr || hoursStr.toLowerCase() === "closed") {
      rules.push(`${osmDay} off`);
      continue;
    }
    // Ex: "8:30 AM – 12:30 PM, 2:30 – 7:00 PM"
    const ranges = hoursStr.split(/,\s*/).map((r) => {
      const dashParts = r.split(/\s*[–\-]\s*/);
      if (dashParts.length === 2) {
        return `${parseAmPmTime(dashParts[0])}-${parseAmPmTime(dashParts[1])}`;
      }
      return r.trim();
    });
    rules.push(`${osmDay} ${ranges.join(",")}`);
  }

  return rules.join("; ");
}

/** Normalise les horaires vers le format OSM quel que soit le format d'entrée. */
function normalizeHoraires(horaires: string): string {
  const s = horaires.trim();
  if (isGoogleFormat(s)) return convertGoogleToOsm(s);
  return s;
}

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

  const s = normalizeHoraires(String(horaires).trim());
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

  const s = normalizeHoraires(String(horaires).trim());
  if (s.toLowerCase() === "24/7") return true;

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

// ─── Planning jour par jour ────────────────────────────────────────────────

const JOURS_FR_FULL: Record<string, string> = {
  Mo: "Lundi",
  Tu: "Mardi",
  We: "Mercredi",
  Th: "Jeudi",
  Fr: "Vendredi",
  Sa: "Samedi",
  Su: "Dimanche",
};

export type DaySchedule = {
  dayCode: string;    // "Mo", "Tu", …
  dayFr: string;      // "Lundi", "Mardi", …
  hours: string | null; // null = Fermé
};

/** Expanse "Mo-Sa" ou "Mo,We,Fr" en tableau de codes de jours individuels. */
function expandDayRange(dayPart: string): string[] {
  const d = dayPart.trim();
  if (d.includes("-")) {
    const [s, e] = d.split("-").map((x) => x.trim());
    const iS = JOURS_ORDER.indexOf(s);
    const iE = JOURS_ORDER.indexOf(e);
    if (iS === -1 || iE === -1) return [];
    return JOURS_ORDER.slice(iS, iE + 1);
  }
  if (d.includes(",")) {
    return d.split(",").map((x) => x.trim()).filter((x) => JOURS_ORDER.includes(x));
  }
  return JOURS_ORDER.includes(d) ? [d] : [];
}

/**
 * Convertit une chaîne horaires OSM en planning de 7 jours (Lun → Dim).
 * Retourne null si les horaires sont absents.
 */
export function expandToDailySchedule(
  horaires: string | null | undefined
): DaySchedule[] | null {
  if (horaires == null || String(horaires).trim() === "") return null;
  const s = normalizeHoraires(String(horaires).trim());

  if (s.toLowerCase() === "24/7") {
    return JOURS_ORDER.map((code) => ({
      dayCode: code,
      dayFr: JOURS_FR_FULL[code] ?? code,
      hours: "Ouvert 24h/24",
    }));
  }

  const schedule: Record<string, string | null> = {};

  for (const rule of s.split(";").map((r) => r.trim()).filter(Boolean)) {
    const parts = rule.split(/\s+/);
    const dayPart = parts[0];
    const rest = parts.slice(1).join(" ").trim();
    const restLower = rest.toLowerCase();

    const hours =
      !rest || restLower === "off" || restLower === "closed"
        ? null
        : rest
            .split(",")
            .map((t) => formatPlageHeures(t.trim()))
            .join(" et ");

    for (const day of expandDayRange(dayPart)) {
      schedule[day] = hours;
    }
  }

  return JOURS_ORDER.map((code) => ({
    dayCode: code,
    dayFr: JOURS_FR_FULL[code] ?? code,
    hours: schedule[code] !== undefined ? schedule[code] : null,
  }));
}
