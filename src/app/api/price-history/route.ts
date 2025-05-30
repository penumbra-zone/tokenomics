import { DurationWindow, pindexer } from "@/lib/db/pindexer";
import { registryClient } from "@/lib/registry";
import { getChainId } from "@/lib/registry/chain-id";
import { findUSDCAssetId } from "@/lib/registry/utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days");
    const windowParam = searchParams.get("window");

    const days = daysParam ? parseInt(daysParam, 10) : 90;
    const allowedWindows: DurationWindow[] = ["1h", "1d", "1w", "1m"];
    const window =
      windowParam && allowedWindows.includes(windowParam as DurationWindow)
        ? (windowParam as DurationWindow)
        : "1d";

    if (isNaN(days) || days <= 0) {
      return NextResponse.json({ error: "Invalid 'days' parameter" }, { status: 400 });
    }

    // Get chain ID from registry/config
    const chainId = await getChainId();
    if (!chainId) {
      return NextResponse.json({ error: "Could not determine chain ID" }, { status: 500 });
    }

    // Get staking asset ID from registry
    const { stakingAssetId } = registryClient.bundled.globals();

    // Get USDC asset using centralized utility
    let quoteAsset = await findUSDCAssetId();
    if (!quoteAsset) {
      throw new Error("USDC asset ID not found");
    }

    const data = await pindexer.getPriceHistory({
      baseAsset: stakingAssetId,
      quoteAsset: quoteAsset,
      chainId: chainId,
      days: days,
      window: window,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching price history:", error);
    return NextResponse.json({ error: "Failed to fetch price history" }, { status: 500 });
  }
}
