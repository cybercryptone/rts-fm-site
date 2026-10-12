export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatWait(seconds: number) {
  const totalMinutes = Math.round(seconds / 60);
  if (totalMinutes < 1) return "now";
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, " ")
    .toUpperCase();
}

export function formatDateCompact(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}.${mm}.${yy}`;
}

// "2026-08-14" + "2026-08-16" -> "14-16 AUG 2026"; falls back to two full
// dates ("14 AUG 2026 - 03 SEP 2026") when the range crosses months or years.
export function formatDateRange(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (start.getTime() === end.getTime()) return formatDate(startIso);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    const month = end.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
    const year = end.getFullYear();
    return `${start.getDate()}-${end.getDate()} ${month} ${year}`;
  }
  return `${formatDate(startIso)} - ${formatDate(endIso)}`;
}

// Feed titles look like "Artist | Venue x Label, City 12.06.2026" — split
// the artist from the venue/city/date so the two can get separate
// typographic treatment instead of running together as one dense string.
export function splitTitle(title: string) {
  const idx = title.indexOf(" | ");
  if (idx === -1) return { artist: title, meta: "" };
  const artist = title.slice(0, idx).trim();
  const rest = title
    .slice(idx + 3)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" · ");
  return { artist, meta: rest };
}

// Search-result snippet limit. Longer descriptions get truncated by Google,
// so cut at the last full sentence that fits, else at a word boundary.
const META_DESCRIPTION_MAX = 155;

export function metaDescription(text: string, max = META_DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const window = clean.slice(0, max);
  const lastSentence = Math.max(
    window.lastIndexOf(". "),
    window.lastIndexOf("! "),
    window.lastIndexOf("? "),
  );
  if (lastSentence >= 80) return window.slice(0, lastSentence + 1);
  const cut = clean.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${cut.slice(0, space > 0 ? space : cut.length).replace(/[,;:\s-]+$/, "")}…`;
}
