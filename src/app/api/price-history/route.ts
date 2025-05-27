import { DurationWindow, pindexer } from "@/lib/db/pindexer";
import { NextResponse } from "next/server";

export const dynamic = "auto";
export const revalidate = 6;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const daysParam = searchParams.get("days");
  const windowParam = searchParams.get("window");

  const days = daysParam ? parseInt(daysParam, 10) : 90;
  const allowedWindows: DurationWindow[] = ["1h", "1d", "1w", "1m"];
  const window =
    windowParam && allowedWindows.includes(windowParam as DurationWindow)
      ? (windowParam as DurationWindow)
      : "1d";

  if (isNaN(days) || days <= 0) {
    return NextResponse.json({ error: "Invalid 'days' parameter" }, { status: 400 });
  }

  const data = await pindexer.getPriceHistory(days, window);
  return NextResponse.json(data);
}
