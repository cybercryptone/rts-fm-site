#!/usr/bin/env node
// Freshness check for src/lib/festivals.ts. Run: npm run check:festivals
// Reports, per festival: age of lastVerified, whether the next edition's end
// date has passed, and whether the official site and ticket URL still
// respond. It only reads and reports; dates, prices and ticket status still
// have to be re-checked by hand against the festival's own pages, after
// which lastVerified is bumped.
import { readFileSync } from "node:fs";

const STALE_DAYS = Number(process.env.STALE_DAYS ?? 60);
const src = readFileSync(new URL("../src/lib/festivals.ts", import.meta.url), "utf8");
const start = src.indexOf("export const FESTIVALS");
const body = src.slice(start, src.indexOf("\n];", start));
const blocks = body.split(/\n  \{\n/).slice(1).map((b) => "\n" + b);

const pick = (block, key) => block.match(new RegExp(`\\n    ${key}: "([^"]*)"`))?.[1];
const festivals = blocks.map((b) => ({
  slug: pick(b, "slug"),
  website: pick(b, "website"),
  ticketUrl: pick(b, "ticketUrl"),
  endDate: pick(b, "endDate"),
  dateStatus: pick(b, "dateStatus"),
  lastVerified: pick(b, "lastVerified"),
}));

async function probe(url) {
  const opts = { redirect: "follow", signal: AbortSignal.timeout(15000), headers: { "user-agent": "rts-fm-festival-check/1.0" } };
  try {
    let res = await fetch(url, { ...opts, method: "HEAD" });
    if (res.status >= 400) res = await fetch(url, { ...opts, method: "GET" });
    return res.status;
  } catch (e) {
    return `ERR ${e.cause?.code ?? e.name}`;
  }
}

const today = new Date();
let problems = 0;
for (const f of festivals) {
  const notes = [];
  if (!f.lastVerified) notes.push("no lastVerified");
  else {
    const age = Math.floor((today - new Date(f.lastVerified)) / 86_400_000);
    if (age > STALE_DAYS) notes.push(`last verified ${age} days ago`);
  }
  if (f.endDate && new Date(f.endDate) < today) notes.push("edition ended: look for the next dates");
  if (f.dateStatus !== "confirmed") notes.push(`dates ${f.dateStatus}`);
  for (const [label, url] of [["site", f.website], ["tickets", f.ticketUrl]]) {
    if (!url) continue;
    const status = await probe(url);
    if (typeof status !== "number" || status >= 400) {
      // A TypeError from fetch is usually a redirect loop or queue page
      // (ticket shops behind a waiting room), so flag it for a manual look
      // without failing the run.
      const manual = typeof status === "string" && status.includes("TypeError");
      notes.push(`${label} ${status}${manual ? " (check manually)" : ""} (${url})`);
      if (!manual) problems++;
    }
  }
  console.log(`${f.slug.padEnd(24)} ${notes.length ? notes.join("; ") : "ok"}`);
}
console.log(`\n${festivals.length} festivals checked, ${problems} broken link(s).`);
process.exit(problems > 0 ? 1 : 0);
