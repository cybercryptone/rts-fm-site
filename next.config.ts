import type { NextConfig } from "next";

// Content-Security-Policy is deliberately not set here: the site pulls from
// several third-party origins (YouTube embeds/thumbnails, SoundCloud audio/
// artwork, Wikimedia photos, Bandcamp covers, Google Tag Manager), and a
// wrong CSP silently breaks playback or images rather than erroring loudly.
// Needs a carefully built and tested allowlist before shipping, not a rushed
// one alongside the low-risk headers below.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
