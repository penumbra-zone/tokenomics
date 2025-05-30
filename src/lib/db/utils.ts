import { sql } from "kysely";
import type { DurationWindow } from "./pindexer/types";

/**
 * Get the appropriate date grouping expression based on DurationWindow for PostgreSQL
 * @param window The duration window for grouping
 * @param timestampField The timestamp field reference
 */
export function getDateGroupExpression(window: DurationWindow, timestampField: string) {
  switch (window) {
    case "1m":
      return sql`date_trunc('minute', ${sql.ref(timestampField)})`;
    case "15m":
      // Group by 15-minute intervals
      return sql`date_trunc('hour', ${sql.ref(timestampField)}) + INTERVAL '15 minutes' * FLOOR(EXTRACT(minute FROM ${sql.ref(timestampField)}) / 15)`;
    case "1h":
      return sql`date_trunc('hour', ${sql.ref(timestampField)})`;
    case "4h":
      // Group by 4-hour intervals
      return sql`date_trunc('day', ${sql.ref(timestampField)}) + INTERVAL '4 hours' * FLOOR(EXTRACT(hour FROM ${sql.ref(timestampField)}) / 4)`;
    case "1d":
      return sql`date_trunc('day', ${sql.ref(timestampField)})`;
    case "1w":
      return sql`date_trunc('week', ${sql.ref(timestampField)})`;
    case "1mo":
      return sql`date_trunc('month', ${sql.ref(timestampField)})`;
    default:
      return sql`date_trunc('day', ${sql.ref(timestampField)})`;
  }
} 

/**
 * Calculate date range for historical data based on days parameter
 * @param days Number of days to look back
 * @returns Object with startDate and endDate
 */
export function getDateRangeForDays(days: number): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  
  return { startDate, endDate };
}

/**
 * Get appropriate DurationWindow based on days parameter
 * @param days Number of days for the time series
 * @returns Appropriate DurationWindow
 */
export function getDurationWindowForDays(days: number): DurationWindow {
  if (days <= 1) {
    return "1h"; // For very short periods, use hourly data
  } else if (days <= 7) {
    return "1d"; // For week or less, daily data
  } else if (days <= 30) {
    return "1d"; // For month or less, daily data
  } else {
    return "1w"; // For longer periods, weekly data
  }
}