import { ImageResponse } from "next/og";
import { SITE } from "@/lib/data";
import { EQ_BARS, EQ_VIEWBOX } from "@/lib/eq-bars";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE.name} — ${SITE.tagline}`;

const EQ_RENDER_WIDTH = 460;
const EQ_RENDER_HEIGHT = Math.round(
  (EQ_VIEWBOX.h / EQ_VIEWBOX.w) * EQ_RENDER_WIDTH,
);

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          padding: "72px",
          backgroundColor: "#d8dade",
          backgroundImage:
            "radial-gradient(46% 60% at 30% 55%, rgba(224,74,63,0.4) 0%, rgba(224,74,63,0) 72%), radial-gradient(60% 60% at 88% 8%, rgba(255,255,255,0.5) 0%, transparent 62%), radial-gradient(55% 65% at 4% 0%, rgba(110,114,121,0.55) 0%, transparent 68%)",
          fontFamily: "sans-serif",
        }}
      >
        <svg
          width={EQ_RENDER_WIDTH}
          height={EQ_RENDER_HEIGHT}
          viewBox={`0 0 ${EQ_VIEWBOX.w} ${EQ_VIEWBOX.h}`}
          style={{ position: "absolute", right: 40, top: 72 + 20 }}
        >
          {EQ_BARS.map((b, i) => (
            <ellipse
              key={i}
              cx={b.cx}
              cy={b.cy}
              rx={b.rx}
              ry={b.ry}
              fill="#ff5000"
              opacity={0.9}
            />
          ))}
        </svg>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
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
                fontSize: 160,
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
                marginTop: 20,
                fontSize: 34,
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
      </div>
    ),
    { ...size },
  );
}
