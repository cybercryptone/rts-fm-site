import { metaDescription } from "./format";
import type { ArtistMeta } from "./artists";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// "18 June 1963" -> age today; null for year-only or unparseable dates, since
// an age from a bare year could be off by one.
function ageFromBorn(born: string, now = new Date()): number | null {
  const m = born.match(/^(\d{1,2}) ([A-Za-z]+) (\d{4})$/);
  if (!m) return null;
  const month = MONTHS.findIndex((name) => name.toLowerCase() === m[2].toLowerCase());
  if (month < 0) return null;
  const day = Number(m[1]);
  const year = Number(m[3]);
  let age = now.getUTCFullYear() - year;
  if (now.getUTCMonth() < month || (now.getUTCMonth() === month && now.getUTCDate() < day)) age -= 1;
  return age;
}

// Searches for "<artist> age", "how old is <artist>" and "where is <artist>
// from" land on these pages, so the snippet should answer them directly. Built
// only from the verified quick facts; artists without a sourced birth date
// keep their hand-written excerpt (or an explicit metaDescription override).
export function artistMetaDescription(artist: ArtistMeta, now = new Date()): string {
  if (artist.metaDescription) return metaDescription(artist.metaDescription);
  const { born, birthplace, nationality, died } = artist.facts ?? {};
  if (!born) return metaDescription(artist.excerpt);
  if (died) return metaDescription(`${artist.name} (born ${born}${birthplace ? ` in ${birthplace}` : ""}) died in ${died}. ${artist.excerpt}`);
  const age = ageFromBorn(born, now);
  const place = birthplace ? ` in ${birthplace}` : "";
  const opener = age !== null
    ? `${artist.name} is ${age} years old, born ${born}${place}.`
    : `${artist.name} was born in ${born}${place}.`;
  const roleRaw = [nationality, artist.jobTitle.replace(/^DJ & /, "DJ and ").toLowerCase()].filter(Boolean).join(" ");
  const role = `${roleRaw.charAt(0).toUpperCase()}${roleRaw.slice(1)}`.replace(/\bDj\b|\bdj\b/g, "DJ").replace(/\bberghain\b/gi, "Berghain");
  const genres = artist.genres.slice(0, 2).join(" and ");
  const full = `${opener} ${role}${genres ? ` known for ${genres}` : ""}.`;
  if (full.length <= 155) return full;
  const short = `${opener} ${role}.`;
  return metaDescription(short.length <= 155 ? short : opener);
}
