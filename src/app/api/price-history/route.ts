import { NextResponse } from 'next/server';

export async function GET() {
  // Generate 90 days of daily price history
  const days = 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));
  let price = 2.0;
  let marketCap = 200_000_000;
  const data = [];
  for (let i = 0; i < days; i++) {
    // Simulate price with some random walk
    const change = (Math.random() - 0.5) * 0.08; // up to ±4%
    price = Math.max(0.5, price + change);
    marketCap = Math.round(price * 100_000_000 + (Math.random() - 0.5) * 1_000_000);
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    data.push({
      date: date.toISOString().slice(0, 10),
      price: Number(price.toFixed(2)),
      marketCap,
    });
  }
  return NextResponse.json(data);
} 