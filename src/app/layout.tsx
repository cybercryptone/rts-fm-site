import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { SITE, SOCIALS } from "@/lib/data";
import { PlayerProvider } from "@/lib/PlayerProvider";
import PlayerDock from "@/components/PlayerDock";

// Fonts are self-hosted (latin subset, variable woff2 files originally from
// Google Fonts, all four families under the SIL Open Font License) instead of
// being fetched from Google at build time. A failed fetch during `next build`
// on the host took the whole deploy down once, so the build no longer depends
// on the network for fonts.
const syne = localFont({
  src: "../fonts/Syne-latin.woff2",
  variable: "--font-display",
  weight: "400 800",
  display: "swap",
});

const unbounded = localFont({
  src: "../fonts/Unbounded-latin.woff2",
  variable: "--font-headline",
  weight: "200 900",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: "../fonts/SpaceGrotesk-latin.woff2",
  variable: "--font-sans",
  weight: "300 700",
  display: "swap",
});

const jetBrainsMono = localFont({
  src: "../fonts/JetBrainsMono-latin.woff2",
  variable: "--font-mono",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline} & Label`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "RTS.FM",
    "underground radio",
    "internet radio",
    "techno label",
    "tech house",
    "minimal house",
    "minimal techno",
    "electronica",
    "live DJ sets",
    "independent record label",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Music",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline} & Label`,
    description: SITE.description,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline} & Label`,
    description: SITE.description,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  verification: {
    google: "ResQCGLqgackQ2t2SppMi-vIY840viZwxbVgDujcD84",
    yandex: "6ba88ab1ec73ad70",
  },
};

const GA_MEASUREMENT_ID = "G-0DY7WHB8BH";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/icon.png`,
  description: SITE.description,
  foundingDate: String(SITE.founded),
  // The Wikipedia entry is included specifically to help Google's Knowledge
  // Graph disambiguate this Organization from the several unrelated "RTS"
  // entities (Radio Télévision Suisse, Radio Television of Serbia, Somfy's
  // RTS home-automation line) that outrank rts.fm for bare-acronym queries.
  sameAs: [...SOCIALS.map((s) => s.href), "https://en.wikipedia.org/wiki/RTS.FM"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${unbounded.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <PlayerProvider>
          {children}
          <PlayerDock />
        </PlayerProvider>
      </body>
    </html>
  );
}
