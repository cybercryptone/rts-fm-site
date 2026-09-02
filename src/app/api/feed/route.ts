import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import { FEED_URL } from "@/lib/data";

export const revalidate = 900; // 15 minutes

export type FeedEpisode = {
  id: string;
  title: string;
  pubDate: string;
  durationSeconds: number;
  audioUrl: string;
  image: string;
  link: string;
};

export type FeedResponse = {
  title: string;
  image: string;
  episodes: FeedEpisode[];
};

function parseDuration(raw: unknown): number {
  const str = String(raw ?? "").trim();
  if (!str) return 0;
  const parts = str.split(":").map(Number);
  if (parts.some((n) => Number.isNaN(n))) return 0;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

function toArray<T>(v: T | T[] | undefined): T[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

export async function GET() {
  try {
    const res = await fetch(FEED_URL, {
      headers: { "User-Agent": "RTS.FM website (+https://rts.fm)" },
      next: { revalidate },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Feed fetch failed: ${res.status}` },
        { status: 502 }
      );
    }

    const xml = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const data = parser.parse(xml);

    const channel = data?.rss?.channel;
    if (!channel) {
      return NextResponse.json({ error: "Malformed feed" }, { status: 502 });
    }

    const items = toArray(channel.item).slice(0, 12);

    const episodes: FeedEpisode[] = items.map((item) => ({
      id: String(item.guid?.["#text"] ?? item.guid ?? item.link ?? item.title),
      title: String(item.title ?? "Untitled"),
      pubDate: String(item.pubDate ?? ""),
      durationSeconds: parseDuration(item["itunes:duration"]),
      audioUrl: String(item.enclosure?.["@_url"] ?? ""),
      image: String(
        item["itunes:image"]?.["@_href"] ?? channel["itunes:image"]?.["@_href"] ?? ""
      ),
      link: String(item.link ?? ""),
    }));

    const payload: FeedResponse = {
      title: String(channel.title ?? "RTS.FM"),
      image: String(channel["itunes:image"]?.["@_href"] ?? ""),
      episodes: episodes.filter((e) => e.audioUrl),
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "public, max-age=0, s-maxage=900" },
    });
  } catch {
    return NextResponse.json({ error: "Feed unavailable" }, { status: 502 });
  }
}
