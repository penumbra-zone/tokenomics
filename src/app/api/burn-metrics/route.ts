import { pindexer } from "@/lib/db/pindexer";
import { NextResponse } from "next/server";

export const dynamic = "auto";
export const revalidate = 6;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days")) || 30;
  
  const data = await pindexer.getBurnMetrics(days);
  return NextResponse.json(data);
}
