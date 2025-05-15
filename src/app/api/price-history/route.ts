import { NextResponse } from "next/server";

import { PindexerConnection } from "@/lib/db/pindexer";

export const dynamic = "auto";
export const revalidate = 6;

export async function GET() {
  const db = new PindexerConnection();
  const data = await db.getPriceHistory(90);
  return NextResponse.json(data);
}
