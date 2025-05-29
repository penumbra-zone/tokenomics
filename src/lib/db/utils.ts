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