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
