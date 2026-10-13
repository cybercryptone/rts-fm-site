import { APPLE_PODCASTS_URL } from "@/lib/data";

// Apple's "Listen on Apple Podcasts" badge, used unaltered (cropped to its
// rounded outline, transparent corners). Plain <img>: a tiny static PNG,
// fixed size, no need for Next/Image.
export default function ApplePodcastsBadge({ className = "h-10" }: { className?: string }) {
  return (
    <a
      href={APPLE_PODCASTS_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Listen to RTS.FM on Apple Podcasts"
      className="inline-block transition-opacity hover:opacity-80"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- small static brand badge */}
      <img
        src="/images/badges/apple-podcasts-listen.png"
        alt="Listen on Apple Podcasts"
        width={420}
        height={102}
        loading="lazy"
        className={`${className} w-auto`}
      />
    </a>
  );
}
