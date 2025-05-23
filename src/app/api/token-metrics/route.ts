import { NextResponse } from "next/server";
import { pindexer } from "@/lib/db/pindexer";

export const dynamic = "auto";
export const revalidate = 6;

export async function GET() {
  const data = await pindexer.getTokenMetrics();
  return NextResponse.json(data);
}
