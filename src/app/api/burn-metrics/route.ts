import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for now - replace with actual data fetching logic
  const data = {
    totalBurned: 50000000,
    bySource: {
      transactionFees: 20000000,
      dexArbitrage: 15000000,
      auctionBurns: 10000000,
      dexBurns: 5000000
    },
    burnRate: 0.0001,
    historicalBurnRate: [
      { timestamp: '2024-01-01', rate: 0.00008 },
      { timestamp: '2024-02-01', rate: 0.00009 },
      { timestamp: '2024-03-01', rate: 0.0001 }
    ]
  };

  return NextResponse.json(data);
} 