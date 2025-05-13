import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for now - replace with actual data fetching logic
  const data = [
    {
      category: 'Staked',
      percentage: 40,
      amount: 400000000,
      subcategories: [
        {
          name: 'Validators',
          amount: 300000000,
          percentage: 75
        },
        {
          name: 'Delegators',
          amount: 100000000,
          percentage: 25
        }
      ]
    },
    {
      category: 'DEX Liquidity',
      percentage: 25,
      amount: 250000000,
      subcategories: [
        {
          name: 'PEN/USDC',
          amount: 150000000,
          percentage: 60
        },
        {
          name: 'PEN/ETH',
          amount: 100000000,
          percentage: 40
        }
      ]
    },
    {
      category: 'Community Pool',
      percentage: 15,
      amount: 150000000
    },
    {
      category: 'Circulating',
      percentage: 20,
      amount: 200000000
    }
  ];

  return NextResponse.json(data);
} 