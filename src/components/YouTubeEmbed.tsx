export default function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <figure className="mt-7">
      <div className="aspect-video overflow-hidden rounded-xl border border-line">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-dim">
        {title}
      </figcaption>
    </figure>
  );
}
