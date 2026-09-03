"use client";

import { useEffect, useState } from "react";

export default function HudClock() {
  const [time, setTime] = useState("00:00:00");

  useEffect(() => {
    const tick = () => {
      setTime(new Date().toUTCString().split(" ")[4]);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="hud-live-clock">{time} UTC</span>;
}
