import { pindexer } from "@/lib/db/pindexer";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await pindexer.getSupplyMetrics();
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=6, stale-while-revalidate',
    },
  });
}
