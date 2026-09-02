import type { Metadata } from "next";
import {
  Bodoni_Moda,
  Unbounded,
  Space_Grotesk,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  weight: "variable",
});

const unbounded = Unbounded({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "RTS.FM — Online Underground Radio & Label",
  description:
    "RTS.FM is an independent underground internet radio and record label broadcasting live audio-visual sets since 2006 — tech house, minimal house, minimal techno, electronica.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${unbounded.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg font-sans">
        {children}
      </body>
    </html>
  );
}
