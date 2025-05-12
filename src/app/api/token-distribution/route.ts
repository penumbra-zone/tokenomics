import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data
  const data = [
    {
      category: 'Team & Advisors',
      percentage: 20,
      amount: 200000000,
    },
    {
      category: 'Community & Ecosystem',
      percentage: 30,
      amount: 300000000,
    },
    {
      category: 'Private Sale',
      percentage: 15,
      amount: 150000000,
    },
    {
      category: 'Public Sale',
      percentage: 25,
      amount: 250000000,
    },
    {
      category: 'Reserve',
      percentage: 10,
      amount: 100000000,
    },
  ];

  return NextResponse.json(data);
} 