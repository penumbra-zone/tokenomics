import { NextResponse } from "next/server";
import { pindexer } from "@/lib/db/pindexer";

export const dynamic = "auto";
export const revalidate = 6;

export async function GET() {
  const data = await pindexer.getLqtMetrics();
  return NextResponse.json(data);
}
