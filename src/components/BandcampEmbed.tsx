export default function BandcampEmbed({ album, title }: { album: string; title: string }) {
  const src = `https://bandcamp.com/EmbeddedPlayer/album=${album}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/`;
  return (
    <figure className="mt-7">
      <div className="overflow-hidden rounded-xl border border-line">
        <iframe
          src={src}
          title={title}
          loading="lazy"
          seamless
          width="100%"
          height="120"
          className="block"
        />
      </div>
      <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-dim">
        {title}
      </figcaption>
    </figure>
  );
}
