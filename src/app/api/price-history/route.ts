import { NextResponse } from 'next/server';

// Mock price history data
const priceHistory = [
  { date: '2024-01-01', price: 1.25 },
  { date: '2024-01-02', price: 1.30 },
  { date: '2024-01-03', price: 1.28 },
  { date: '2024-01-04', price: 1.35 },
  { date: '2024-01-05', price: 1.40 },
  { date: '2024-01-06', price: 1.38 },
  { date: '2024-01-07', price: 1.42 },
  { date: '2024-01-08', price: 1.45 },
  { date: '2024-01-09', price: 1.43 },
  { date: '2024-01-10', price: 1.48 },
  { date: '2024-01-11', price: 1.50 },
  { date: '2024-01-12', price: 1.52 },
  { date: '2024-01-13', price: 1.55 },
  { date: '2024-01-14', price: 1.53 },
  { date: '2024-01-15', price: 1.58 },
];

export async function GET() {
  return NextResponse.json(priceHistory);
} 