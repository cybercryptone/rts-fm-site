import { NextResponse } from "next/server";
import { getCurrentBroadcastPosition, getNextBroadcastPosition } from "@/lib/virtualBroadcast";

// Keeps the ~500KB archive dataset and schedule math server-side; the
// client only ever receives the single current position, never the dataset.
//
// ?after=<videoId> steps to the entry right after that one instead of
// re-deriving "now" from the wall clock — see getNextBroadcastPosition.
export async function GET(request: Request) {
  const after = new URL(request.url).searchParams.get("after");
  const position = after
    ? getNextBroadcastPosition(after)
    : getCurrentBroadcastPosition();
  return NextResponse.json(position, {
    headers: { "Cache-Control": "no-store" },
  });
}
