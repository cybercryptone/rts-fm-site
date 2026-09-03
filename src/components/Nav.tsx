"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/#radio", label: "radio" },
  { href: "/#label", label: "label" },
  { href: "/blog", label: "blog" },
  { href: "/#about", label: "about" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-bg/80 backdrop-blur-md" : ""
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 sm:px-10">
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-fg"
        >
          RTS.FM
        </Link>

        <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-[0.18em] text-fg-dim sm:flex">
          {LINKS.map((l) => {
            const isActive = l.href === "/blog" && pathname?.startsWith("/blog");
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative transition-colors hover:text-fg ${
                  isActive ? "font-semibold text-fg" : ""
                }`}
              >
                {isActive && (
                  <span className="absolute -top-3 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
                )}
                {l.label}
              </Link>
            );
          })}
          <a
            href="https://t.me/rtsfm"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line px-3 py-1.5 text-fg transition-colors hover:border-accent hover:text-accent"
          >
            join telegram
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 sm:hidden"
        >
          <span
            className={`h-px w-5 bg-fg transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-5 bg-fg transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-bg px-6 py-6 font-mono text-sm uppercase tracking-[0.18em] text-fg-dim sm:hidden">
          <div className="flex flex-col gap-5">
            {LINKS.map((l) => {
              const isActive = l.href === "/blog" && pathname?.startsWith("/blog");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`hover:text-fg ${isActive ? "font-semibold text-fg" : ""}`}
                >
                  {l.label}
                </Link>
              );
            })}
            <a
              href="https://t.me/rtsfm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
            >
              join telegram
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
