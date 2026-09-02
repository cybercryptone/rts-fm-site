"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#radio", label: "radio" },
  { href: "#label", label: "label" },
  { href: "#about", label: "about" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        <a
          href="#top"
          className="font-display text-lg italic tracking-tight text-fg"
        >
          RTS.FM
        </a>

        <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-[0.18em] text-fg-dim sm:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
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
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="hover:text-fg">
                {l.label}
              </a>
            ))}
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
