export default function SoundCloudEmbed({ url, title }: { url: string; title: string }) {
  const src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
  return (
    <figure className="mt-7">
      <div className="overflow-hidden rounded-xl border border-line">
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allow="autoplay"
          width="100%"
          height="166"
          className="block"
        />
      </div>
      <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-dim">
        {title}
      </figcaption>
    </figure>
  );
}
