'use client';

import { useGetTokenMetricsQuery, useGetTokenDistributionQuery, useGetPriceHistoryQuery } from '@/store/api/tokenomicsApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/Card';
import { ThemeSwitcher } from '@/components/theme-switcher';
import dynamic from 'next/dynamic';

// Create a client-side only chart component
const TokenDistributionChart = dynamic(
  () => import('@/modules/tokenomics/components/TokenDistributionChart'),
  { ssr: false }
);

const PriceHistoryChart = dynamic(
  () => import('@/modules/tokenomics/components/PriceHistoryChart'),
  { ssr: false }
);

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useGetTokenMetricsQuery();
  const { data: distribution, isLoading: distributionLoading, error: distributionError } = useGetTokenDistributionQuery();
  const { data: priceHistory, isLoading: priceHistoryLoading, error: priceHistoryError } = useGetPriceHistoryQuery();

  if (metricsLoading || distributionLoading || priceHistoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard data...</div>
      </div>
    );
  }

  if (metricsError || distributionError || priceHistoryError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">Error loading dashboard data</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Penumbra Tokenomics Dashboard</h1>
        <ThemeSwitcher />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics?.totalSupply.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Circulating Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics?.circulatingSupply.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${metrics?.marketCap.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Token Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <TokenDistributionChart data={distribution || []} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Price History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <PriceHistoryChart data={priceHistory || []} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 