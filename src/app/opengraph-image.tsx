import { ImageResponse } from "next/og";
import { SITE } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE.name} — ${SITE.tagline}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#d8dade",
          backgroundImage:
            "radial-gradient(46% 60% at 38% 46%, rgba(224,74,63,0.55) 0%, rgba(224,74,63,0) 72%), radial-gradient(60% 60% at 84% 6%, rgba(255,255,255,0.55) 0%, transparent 62%), radial-gradient(55% 65% at 4% 0%, rgba(110,114,121,0.6) 0%, transparent 68%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#232327",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              backgroundColor: "#ff5000",
              display: "flex",
            }}
          />
          EST. {SITE.founded}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 168,
              fontWeight: 800,
              color: "#121214",
              letterSpacing: -2,
              lineHeight: 1,
              display: "flex",
            }}
          >
            {SITE.name}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: -1,
              color: "#121214",
              display: "flex",
            }}
          >
            {SITE.tagline.toUpperCase()}.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#232327",
          }}
        >
          Independent Radio &amp; Label — Since {SITE.founded}
        </div>
      </div>
    ),
    { ...size }
  );
}
