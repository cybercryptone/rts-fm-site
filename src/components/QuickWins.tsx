export default function QuickWins({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/[0.06] p-6 sm:p-7">
      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        quick wins
      </p>
      <div className="quick-wins-body mt-4">{children}</div>
    </div>
  );
}
