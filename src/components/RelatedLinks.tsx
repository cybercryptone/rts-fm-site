import Link from "next/link";
import type { RelatedGroup } from "@/lib/related";

// Server-rendered link lists, so the links exist in the initial HTML for
// crawlers. Styling mirrors the existing "related on rts.fm" block.
export default function RelatedLinks({ groups }: { groups: RelatedGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <>
      {groups.map((group) => (
        <nav
          key={group.heading}
          aria-label={group.heading}
          className="mt-14 border-t border-line pt-8"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
            {group.heading}
          </p>
          <ul className="mt-4 flex flex-col divide-y divide-line">
            {group.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between gap-4 py-3 text-sm font-semibold text-fg transition-colors hover:text-accent"
                >
                  <span>
                    {item.title}
                    {item.meta && (
                      <span className="ml-2 font-mono text-[11px] font-normal uppercase tracking-[0.1em] text-fg-dim">
                        {item.meta}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-accent">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </>
  );
}
