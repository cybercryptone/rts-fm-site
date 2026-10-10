import Link from "next/link";
import {
  festivalDateLabel,
  festivalDurationDays,
  type Festival,
} from "@/lib/festivals";

function TicketLink({ festival }: { festival: Festival }) {
  if (!festival.ticketUrl) {
    return (
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim/60">
        Tickets TBA
      </span>
    );
  }
  if (festival.ticketStatus === "sold-out") {
    return (
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim/60 line-through">
        Sold Out
      </span>
    );
  }
  return (
    <a
      href={festival.ticketUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition-colors hover:text-accent-soft"
    >
      Tickets ↗
    </a>
  );
}

function monthLabel(startDate: string): string {
  return new Date(`${startDate}T00:00:00Z`).toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function Row({ festival }: { festival: Festival }) {
  const days = festivalDurationDays(festival);
  return (
    <li className="grid gap-3 py-6 sm:grid-cols-[190px_minmax(0,1fr)_auto] sm:items-center sm:gap-8">
      <div className="font-mono text-[13px] font-bold uppercase leading-snug tracking-[0.1em] text-accent">
        {festivalDateLabel(festival)}
        {days && days > 1 && (
          <span className="ml-2 font-normal text-fg-dim">{days} days</span>
        )}
      </div>
      <div className="min-w-0">
        <Link
          href={`/festivals/${festival.slug}`}
          className="font-display text-xl font-bold uppercase leading-tight tracking-[-0.02em] text-fg transition-colors hover:text-accent sm:text-2xl"
        >
          {festival.name}
        </Link>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-dim">
          {festival.city}, {festival.country}
          {festival.genres.length > 0 && <> · {festival.genres.join(" / ")}</>}
        </p>
      </div>
      <TicketLink festival={festival} />
    </li>
  );
}

// Server-rendered list for the year and country hub pages: grouped by month
// when `byMonth` is set (dated festivals only), otherwise one flat list.
export default function FestivalCalendar({
  festivals,
  byMonth = false,
}: {
  festivals: Festival[];
  byMonth?: boolean;
}) {
  if (!byMonth) {
    return (
      <ol className="mt-6 divide-y divide-line border-y border-line">
        {festivals.map((f) => (
          <Row key={f.slug} festival={f} />
        ))}
      </ol>
    );
  }

  const groups: { label: string; items: Festival[] }[] = [];
  for (const f of festivals) {
    if (!f.startDate) continue;
    const label = monthLabel(f.startDate);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(f);
    else groups.push({ label, items: [f] });
  }

  return (
    <div className="mt-8 flex flex-col gap-10">
      {groups.map((g) => (
        <section key={g.label}>
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-fg-dim">
            {g.label}
          </h2>
          <ol className="mt-3 divide-y divide-line border-y border-line">
            {g.items.map((f) => (
              <Row key={f.slug} festival={f} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
