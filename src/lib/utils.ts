/**
 * Formats a number with appropriate suffix (K, M, B, T)
 * @param num - The number to format
 * @param decimals - Number of decimal places to show (default: 1)
 * @returns Formatted number string with suffix
 */
export function formatNumber(num: number, decimals: number = 1): string {
  if (num === 0) return "0";

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (absNum >= 1e15) {
    return `${sign}${(absNum / 1e15).toFixed(decimals)}Q`;
  } else if (absNum >= 1e12) {
    return `${sign}${(absNum / 1e12).toFixed(decimals)}T`;
  } else if (absNum >= 1e9) {
    return `${sign}${(absNum / 1e9).toFixed(decimals)}B`;
  } else if (absNum >= 1e6) {
    return `${sign}${(absNum / 1e6).toFixed(decimals)}M`;
  } else if (absNum >= 1e3) {
    return `${sign}${(absNum / 1e3).toFixed(decimals)}K`;
  } else {
    return num.toFixed(decimals).toString();
  }
}


/**
 * Helper function to safely convert date to string format for charts
 * Handles both Date objects and string dates from API responses
 */
export const formatDateForChart = (date: Date | string): string => {
  if (typeof date === 'string') {
    return date.split('T')[0]; // Handle ISO string format
  }
  return date.toISOString().split('T')[0]; // Handle Date object
}; 