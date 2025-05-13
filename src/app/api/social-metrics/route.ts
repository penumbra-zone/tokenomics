import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for now - replace with actual data fetching logic
  const data = {
    totalSupply: 1000000000,
    circulatingSupply: 900000000,
    marketCap: 500000000,
    price: 0.5,
    inflationRate: 0.02,
    burnRate: 0.0001
  };

  return NextResponse.json(data);
} 