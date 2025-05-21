import { NextResponse } from "next/server";

import { Pindexer } from "@/lib/db/pindexer/pindexer";

export const dynamic = "auto";
export const revalidate = 6;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days"));

  const db = new Pindexer();
  const data = await db.getPriceHistory(days, "1d");
  return NextResponse.json(data);
}
