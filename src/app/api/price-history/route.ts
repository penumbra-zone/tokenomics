import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for now - replace with actual data fetching logic
  const data = [
    { date: '2024-01-01', price: 0.45, marketCap: 450000000 },
    { date: '2024-01-15', price: 0.48, marketCap: 480000000 },
    { date: '2024-02-01', price: 0.47, marketCap: 470000000 },
    { date: '2024-02-15', price: 0.49, marketCap: 490000000 },
    { date: '2024-03-01', price: 0.50, marketCap: 500000000 },
    { date: '2024-03-15', price: 0.52, marketCap: 520000000 },
    { date: '2024-04-01', price: 0.51, marketCap: 510000000 },
    { date: '2024-04-15', price: 0.53, marketCap: 530000000 },
    { date: '2024-05-01', price: 0.55, marketCap: 550000000 },
    { date: '2024-05-15', price: 0.54, marketCap: 540000000 },
    { date: '2024-06-01', price: 0.56, marketCap: 560000000 },
    { date: '2024-06-15', price: 0.58, marketCap: 580000000 }
  ];

  return NextResponse.json(data);
} 