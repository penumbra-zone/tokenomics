import { NextResponse } from "next/server";

import { Pindexer } from "@/lib/db/pindexer/pindexer";

export const dynamic = "auto";
export const revalidate = 6;

export async function GET() {
  const db = new Pindexer();
  const data = await db.getSupplyMetrics();
  return NextResponse.json(data);
}
