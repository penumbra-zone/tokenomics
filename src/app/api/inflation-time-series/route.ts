import { pindexer } from "@/lib/db/pindexer";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days");

    const days = daysParam ? parseInt(daysParam, 10) : 30;

    if (isNaN(days) || days <= 0) {
      return NextResponse.json({ error: "Invalid 'days' parameter" }, { status: 400 });
    }

    const data = await pindexer.getInflationTimeSeries(days);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching inflation time series:", error);
    return NextResponse.json(
      { error: "Failed to fetch inflation time series" }, 
      { status: 500 }
    );
  }
} 