export default function Cta({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-line bg-bg-elevated p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div className="cta-body text-sm leading-relaxed text-fg-dim sm:max-w-md sm:text-base">
        {children}
      </div>
      <a
        href={href}
        className="shrink-0 whitespace-nowrap rounded-full border border-accent/60 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent hover:text-bg"
      >
        {label}
      </a>
    </div>
  );
}
