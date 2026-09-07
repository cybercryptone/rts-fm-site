import { NextResponse } from "next/server";
import { getCurrentBroadcastPosition } from "@/lib/virtualBroadcast";

// Keeps the ~500KB archive dataset and schedule math server-side; the
// client only ever receives the single current position, never the dataset.
export async function GET() {
  const position = getCurrentBroadcastPosition();
  return NextResponse.json(position, {
    headers: { "Cache-Control": "no-store" },
  });
}
