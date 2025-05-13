import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for now - replace with actual data fetching logic
  const data = {
    totalSupply: 1000000000,
    genesisAllocation: 800000000,
    issuedSinceLaunch: 200000000,
    unstakedSupply: {
      base: 100000000,
      auction: 50000000,
      dex: 75000000,
      arbitrage: 25000000,
      fees: 10000000
    },
    delegatedSupply: {
      base: 500000000,
      delegated: 300000000,
      conversionRate: 0.6
    }
  };

  return NextResponse.json(data);
} 