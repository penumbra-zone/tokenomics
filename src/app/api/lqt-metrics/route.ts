import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for now - replace with actual data fetching logic
  const data = {
    availableRewards: 10000000,
    delegatorRewards: 5000000,
    lpRewards: 3000000,
    votingPower: {
      total: 800000000,
      byAsset: [
        {
          asset: 'PEN',
          votes: 500000000,
          share: 0.625
        },
        {
          asset: 'USDC',
          votes: 200000000,
          share: 0.25
        },
        {
          asset: 'ETH',
          votes: 100000000,
          share: 0.125
        }
      ]
    }
  };

  return NextResponse.json(data);
} 