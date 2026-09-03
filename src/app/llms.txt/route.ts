import { SITE, RELEASES, CITIES, SOCIALS } from "@/lib/data";
import { getAllPosts } from "@/lib/blog";

export const revalidate = 3600; // 1 hour

export async function GET() {
  const posts = getAllPosts();

  const lines: string[] = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `${SITE.name} is an invite-only, non-commercial, artist-run internet radio and record label, broadcasting live audio-visual DJ sets from studios worldwide since ${SITE.founded}. Genres: tech house, minimal house, minimal techno, electronica.`,
    "",
    "## Radio",
    "",
    `- [Live radio & archived sets](${SITE.url}/#radio): live and recorded DJ sets, broadcast from studios in ${CITIES.join(", ")}.`,
    "- [YouTube archive](https://www.youtube.com/user/rtsfmmoscow/videos): thousands of recorded live sets.",
    "- [SoundCloud](https://soundcloud.com/rtsfm): the show's audio feed.",
    "",
    "## Label",
    "",
    `- [Bandcamp catalog](https://rtsfm.bandcamp.com/): the full release catalog, ${RELEASES[RELEASES.length - 1].cat} through ${RELEASES[0].cat}.`,
    ...RELEASES.slice(0, 8).map(
      (r) => `- [${r.artist} — ${r.cat}${r.title ? `, "${r.title}"` : ""}](${r.href})`,
    ),
    "",
    "## Blog",
    "",
    `- [Blog index](${SITE.url}/blog): editorial writing on underground electronic music, club culture, and the industry.`,
    ...posts.map((p) => `- [${p.title}](${SITE.url}/blog/${p.slug}): ${p.excerpt}`),
    "",
    "## Optional",
    "",
    `- [About](${SITE.url}/#about)`,
    ...SOCIALS.map((s) => `- [${s.label}](${s.href})`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
