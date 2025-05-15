/**
 * Central color definitions and theme color management for the application
 */
import { hslToHex } from "./colorUtils";

/**
 * Core color palette definition for consistent usage across the application
 */
export const COLORS = {
  // Primary brand colors
  primary: {
    DEFAULT: "#f49c43", // Orange
    light: "#f7b472",
    dark: "#d67e2a",
  },

  // Secondary color (teal)
  secondary: {
    DEFAULT: "#2a7a8c",
    light: "#3b97ac",
    dark: "#1c5a67",
  },

  // UI color definitions
  destructive: {
    DEFAULT: "#ef4444", // Red
    light: "#f87171",
    dark: "#b91c1c",
  },

  // Neutral shades
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },

  // Chart color palettes
  charts: {
    // Main palette for donut/pie charts
    categorical: [
      "#f49c43", // Primary (orange)
      "#2a7a8c", // Secondary (teal)
      "#ef4444", // Destructive (red)
      "#8b5cf6", // Purple
      "#10b981", // Green
      "#0ea5e9", // Blue
    ],

    // Palette for sequential data (low to high)
    sequential: [
      "#f7b472", // Light primary
      "#f49c43", // Primary
      "#d67e2a", // Dark primary
    ],

    // For diverging data (negative/positive)
    diverging: [
      "#ef4444", // Red (negative)
      "#d4d4d4", // Neutral
      "#10b981", // Green (positive)
    ],
  },

  // Background gradients
  gradients: {
    primaryFade: ["rgba(244,156,67,0.18)", "rgba(244,156,67,0.01)"],
    primaryBar: ["rgba(244,156,67,0.15)", "rgba(244,156,67,0.7)"],
  },
};

/**
 * Gets the current theme color values from CSS variables
 * @returns Object with current theme colors as hex values
 */
export function getCurrentThemeColors() {
  const rootStyles = getComputedStyle(document.documentElement);

  // Get CSS variables and convert to hex
  const getColorFromCssVar = (variable: string) => {
    const hslValue = rootStyles.getPropertyValue(variable).trim();
    if (!hslValue) return "";

    try {
      const [h, s, l] = hslValue.split(" ").map((val) => parseFloat(val));
      return hslToHex(h, s, l);
    } catch (e) {
      return "";
    }
  };

  return {
    primary: getColorFromCssVar("--primary"),
    secondary: getColorFromCssVar("--secondary"),
    destructive: getColorFromCssVar("--destructive"),
    accent: getColorFromCssVar("--accent"),
    muted: getColorFromCssVar("--muted"),
    background: getColorFromCssVar("--background"),
    card: getColorFromCssVar("--card"),
    border: getColorFromCssVar("--border"),
  };
}

/**
 * Named color palettes for different chart types
 */
export const CHART_PALETTES = {
  // Default palette for most charts
  default: COLORS.charts.categorical,

  // For financial/token data
  tokenomics: [
    COLORS.primary.DEFAULT,
    COLORS.secondary.DEFAULT,
    COLORS.destructive.DEFAULT,
    "#8b5cf6", // Purple
    "#10b981", // Green
    "#0ea5e9", // Blue
  ],

  // For comparing positive/negative values
  comparison: COLORS.charts.diverging,

  // For showing sequential data like time series
  sequential: COLORS.charts.sequential,
};
