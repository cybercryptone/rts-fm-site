import ApplePodcastsBadge from "@/components/ApplePodcastsBadge";

// End-of-article prompt: the radio's podcast feed is the one subscription
// action that makes sense after reading, wherever the reader landed from.
export default function ListenBlock() {
  return (
    <aside
      aria-label="Listen to RTS.FM"
      className="mt-14 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
          listen to rts.fm
        </p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-dim">
          Underground house and techno sets from artist-run studios, free as a podcast.
        </p>
      </div>
      <ApplePodcastsBadge />
    </aside>
  );
}
