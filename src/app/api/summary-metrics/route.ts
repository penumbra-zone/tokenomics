import { pindexer } from "@/lib/db/pindexer";
import { NextResponse } from "next/server";

// This prevents static generation at build time
export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await pindexer.getSummaryMetrics();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=6, stale-while-revalidate',
    },
  });
}
