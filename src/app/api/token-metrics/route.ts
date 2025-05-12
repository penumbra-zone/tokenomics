import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data
  const data = {
    totalSupply: 1000000000,
    circulatingSupply: 750000000,
    burnedTokens: 50000000,
    marketCap: 500000000,
    price: 0.5,
  };

  return NextResponse.json(data);
} 