# Tokenomics Calculations Module

This module centralizes all tokenomics calculations for the dashboard, making formulas maintainable and reusable across the application.

## Updated Implementation Notes

Based on the latest clarifications, here are the specific data sources and implementation details:

### Asset IDs

- **UM Token ID**: Use the registry package: https://github.com/prax-wallet/registry/tree/main
- **Implementation**: `registryClient.bundled.globals().stakingAssetId` (can be cached)
- **Note**: UM token ID is hardcoded but fetching from registry is recommended

### Burn Data Sources

All burn data can be retrieved from the `supply_total_unstaked` table:

```sql
-- Total burns by source from supply_total_unstaked
SELECT
    height,
    arb as arbitrage_burns,
    fees as fee_burns,
    (arb + fees) as total_burns
FROM supply_total_unstaked
ORDER BY height DESC
LIMIT 1;

-- Burn rate over time (daily)
WITH daily_burns AS (
    SELECT
        date_trunc('day', bd.timestamp) as day,
        MAX(stu.arb + stu.fees) - MIN(stu.arb + stu.fees) as daily_burn
    FROM supply_total_unstaked stu
             JOIN block_details bd ON stu.height = bd.height
    WHERE bd.timestamp >= NOW() - INTERVAL '30 days'
    GROUP BY date_trunc('day', bd.timestamp)
)
SELECT day, daily_burn FROM daily_burns ORDER BY day DESC;
```

### Token Distribution Data Sources

```sql
-- Token distribution breakdown
WITH latest_supply AS (
  SELECT * FROM insights_supply ORDER BY height DESC LIMIT 1
),
latest_unstaked AS (
  SELECT * FROM supply_total_unstaked ORDER BY height DESC LIMIT 1
)
SELECT
  ls.total as total_supply,
  ls.staked as staked_tokens,
  lu.dex as dex_liquidity,
  lu.auction as auction_locked,
  (ls.total - ls.staked - lu.dex - lu.auction) as circulating_tokens
FROM latest_supply ls, latest_unstaked lu;
```

### Key Data Source Clarifications

1. **Market Cap**: `insights_supply.market_cap` is reliable and always available
2. **Circulating Tokens**: `supply_total_unstaked.um`
3. **UM Locked in DEX**: Use `insights_supply` table
4. **Current Issuance**: Should be **net issuance** (issuance - burns)
5. **IssuancePerBlock**: Constant value available from `viewService.appParams.distributionParams`
6. **Community Pool Balances**: Available via viewService at `penumbra.core.component.community_pool.v1.CommunityPoolAssetBalances`

### Genesis Data

- Genesis data source is pending - initial genesis.json for mainnet needs to be located
- Nodes only serve post-upgrade genesis checkpoint currently

## Structure

```
src/lib/calculations/
├── index.ts                    # Main exports
├── types.ts                    # TypeScript interfaces and types
├── config.ts                   # Configuration constants and utilities
├── supply-calculations.ts      # Supply visualization calculations
├── issuance-calculations.ts    # Issuance metrics calculations
├── burn-calculations.ts        # Burn metrics calculations
├── distribution-calculations.ts # Token distribution calculations
├── lqt-calculations.ts         # Liquidity Tournament calculations
└── README.md                   # This file
```

## Usage

### Basic Import

```typescript
import {
  calculateMarketCap,
  calculateInflationRate,
  calculateTotalBurned,
  getCurrentNetworkConfig,
  CalculationContext,
} from "@/lib/calculations";
```

### Configuration

The module uses a centralized configuration system:

```typescript
import { getCurrentNetworkConfig, DEFAULT_CALCULATION_CONFIG } from "@/lib/calculations";

// Get network-specific configuration
const config = getCurrentNetworkConfig();

// Create calculation context
const context: CalculationContext = {
  config,
  currentHeight: 12345,
  currentTimestamp: new Date(),
};
```

### Supply Calculations

```typescript
import { calculateSupplyMetrics, calculateMarketCap } from "@/lib/calculations";

// Calculate market cap
const marketCap = calculateMarketCap(totalSupply, priceInUSDC);

// Calculate comprehensive supply metrics
const supplyMetrics = calculateSupplyMetrics(
  currentSupplyData,
  context,
  dexLiquiditySupply,
  communityPoolSupply
);
```

### Issuance Calculations

```typescript
import {
  calculateInflationRate,
  calculateIssuanceMetrics,
  calculateInflationTimeSeries,
} from "@/lib/calculations";

// Calculate inflation rate for a period
const inflationRate = calculateInflationRate(currentSupply, pastSupply);

// Calculate comprehensive issuance metrics
const issuanceMetrics = calculateIssuanceMetrics(currentSupplyData, pastSupplyData, context);

// Generate time series for charts
const timeSeries = calculateInflationTimeSeries(supplyDataPoints, "30d");
```

### Burn Calculations

```typescript
import {
  calculateBurnMetrics,
  calculateBurnsBySource,
  calculateBurnRateTimeSeries,
} from "@/lib/calculations";

// Calculate comprehensive burn metrics
const burnMetrics = calculateBurnMetrics(burnData, currentTotalSupply, context);

// Calculate burns by source for pie charts
const burnsBySource = calculateBurnsBySource(burnData);

// Generate burn rate time series
const burnTimeSeries = calculateBurnRateTimeSeries(burnData, "90d", blocksPerDay);
```

### Distribution Calculations

```typescript
import {
  calculateDistributionMetrics,
  calculateTokenDistributionBreakdown,
  validateDistributionTotals,
} from "@/lib/calculations";

// Calculate distribution metrics
const distributionMetrics = calculateDistributionMetrics(
  currentSupplyData,
  unstakedComponents,
  delegatedComponents,
  communityPoolSupply,
  context
);

// Calculate breakdown for pie charts
const breakdown = calculateTokenDistributionBreakdown(
  totalSupply,
  stakedSupply,
  dexLiquiditySupply,
  communityPoolSupply
);

// Validate that totals add up correctly
const validation = validateDistributionTotals(totalSupply, breakdown);
```

### LQT Calculations

```typescript
import {
  calculateLQTMetrics,
  calculateLQTRankings,
  calculateLPPerformanceMetrics,
} from "@/lib/calculations";

// Calculate LQT metrics for an epoch
const lqtMetrics = calculateLQTMetrics(summaryData, votingPowerData, context);

// Calculate LP rankings
const rankings = calculateLQTRankings(lpDataArray, "points");

// Calculate performance metrics
const performance = calculateLPPerformanceMetrics(lpData);
```

## Configuration

### Network Configuration

The module supports different network configurations:

```typescript
import { getNetworkConfig, NETWORK_CONFIGS } from "@/lib/calculations";

// Get specific network config
const mainnetConfig = getNetworkConfig("mainnet");
const testnetConfig = getNetworkConfig("testnet");
const devnetConfig = getNetworkConfig("devnet");
```

### Precision and Formatting

```typescript
import { formatNumber, roundNumber, PRECISION_CONFIG } from "@/lib/calculations";

// Format numbers with appropriate precision
const formattedPercentage = formatNumber(12.3456, "percentages"); // "12.35%"
const formattedTokens = formatNumber(1234567.89, "tokenAmounts"); // "1,234,567.890000"

// Round numbers
const rounded = roundNumber(12.3456, 2); // 12.35
```

## Key Formulas

### Supply Calculations

- **Market Cap**: `MarketCap = CurrentTotalSupply × CurrentPriceInUSDC`
- **Issuance Since Launch**: `IssuanceSinceLaunch = CurrentTotalSupply - GenesisAllocation`
- **Circulating Supply**: `CirculatingTokens = supply_total_unstaked.um`

### Issuance Calculations

- **Inflation Rate**: `InflationRate = (TotalSupply_now - TotalSupply_period_ago) / TotalSupply_period_ago × 100%`
- **Daily Net Issuance**: `DailyNetIssuance = TotalSupply_now - TotalSupply_24h_ago`
- **Projected Annual**: `ProjectedAnnualIssuance = CurrentDailyNetIssuanceRate × 365`

### Burn Calculations

- **Total Burned**: `TotalBurned = supply_total_unstaked.arb + supply_total_unstaked.fees`
- **Percentage Burned**: `%EffectiveSupplyBurned = CumulativeTotalBurned / (CurrentTotalSupply + CumulativeTotalBurned) × 100%`

### Distribution Calculations

- **Percentage Staked**: `%Staked = (insights_supply.staked / insights_supply.total) × 100%`
- **DEX Liquidity**: `supply_total_unstaked.dex`
- **Auction Locked**: `supply_total_unstaked.auction`

## Data Types

### Input Types

- `SupplyData`: Current and historical supply information from `insights_supply`
- `BurnData`: Burn events and amounts from `supply_total_unstaked`
- `UnstakedSupplyComponents`: Breakdown from `supply_total_unstaked`
- `DelegatedSupplyComponent`: Staking delegation information

### Output Types

- `SupplyMetrics`: Comprehensive supply calculations
- `IssuanceMetrics`: Inflation and issuance rates
- `BurnMetrics`: Burn amounts and rates
- `DistributionMetrics`: Token distribution breakdown
- `LQTMetrics`: Liquidity tournament metrics

## Configuration Options

### Time Periods

- `7d`: 7 days
- `30d`: 30 days
- `90d`: 90 days
- `1y`: 1 year

### Precision Settings

- `percentages`: 2 decimal places
- `tokenAmounts`: 6 decimal places
- `rates`: 8 decimal places
- `prices`: 4 decimal places

## Best Practices

1. **Always use the calculation context** when calling comprehensive calculation functions
2. **Validate inputs** before performing calculations
3. **Use the appropriate time period** for different metrics
4. **Format numbers consistently** using the provided formatting utilities
5. **Handle edge cases** like zero denominators in percentage calculations
6. **Use type-safe interfaces** for all data inputs and outputs
7. **Cache asset IDs** from the registry for performance
8. **Use net issuance** for current issuance calculations

## Extending the Module

To add new calculations:

1. Define input/output types in `types.ts`
2. Add calculation functions to the appropriate module file
3. Update configuration in `config.ts` if needed
4. Export new functions from `index.ts`
5. Update this README with usage examples

## Testing

When implementing these calculations in your components, ensure you:

1. Test with edge cases (zero values, negative values)
2. Validate that percentages add up to 100% where expected
3. Check that time series data is properly sorted
4. Verify that network-specific configurations are applied correctly
5. Test with actual database queries using the provided SQL examples
