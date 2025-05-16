import { NextResponse } from "next/server";
import { PindexerConnection } from "@/lib/db/pindexer/pindexer-connection";

export const dynamic = "auto";
export const revalidate = 6;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days")) || 30; // Default to 30 days if not specified
  
  const db = new PindexerConnection();
  const data = await db.getPriceHistory(days);
  return NextResponse.json(data);
}
