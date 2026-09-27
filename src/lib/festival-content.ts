import fs from "fs";
import path from "path";

const FESTIVAL_CONTENT_DIR = path.join(process.cwd(), "src/content/festivals");

// Structured facts (dates, coordinates, tickets, region) live in
// festivals.ts, not here — this only loads the long-form history/FAQ body
// for a detail page. No frontmatter to parse, so unlike blog.ts/artists.ts
// this is a plain file read, not a gray-matter parse.
export function getFestivalContent(slug: string): string | null {
  const filePath = path.join(FESTIVAL_CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}
