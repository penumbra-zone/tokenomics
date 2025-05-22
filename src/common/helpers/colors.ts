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
    DEFAULT: "#BA4D14", // Orange (updated)
    light: "#f7b472",
    dark: "#773517", // Darker (updated)
  },

  // Secondary color (teal)
  secondary: {
    DEFAULT: "#319B96", // Teal (updated)
    light: "#3b97ac",
    dark: "#226362", // Darker (updated)
  },

  // UI color definitions
  destructive: {
    DEFAULT: "#ef4444", // Red
    light: "#f87171",
    dark: "#b91c1c",
  },

  positive: {
    DEFAULT: "#10b981", // Green
    light: "#93c5fd",
    dark: "#059669",
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
  // Main palette for donut/pie charts
  categorical: [
    COLORS.primary.DEFAULT, // Primary
    COLORS.secondary.DEFAULT, // Secondary
    COLORS.primary.dark, // Primary Dark
    COLORS.secondary.dark, // Secondary Dark
    COLORS.primary.light, // Primary Light
    COLORS.secondary.light, // Secondary Light
  ],

  // For financial/token data
  tokenomics: [
    COLORS.primary.DEFAULT, // Primary (updated)
    COLORS.secondary.DEFAULT, // Secondary (updated)
    COLORS.primary.dark,
    COLORS.secondary.dark,
    COLORS.primary.light,
    COLORS.secondary.light,
  ],

  // For comparing positive/negative values
  diverging: [
    COLORS.destructive.DEFAULT, // Red (negative)
    COLORS.neutral[200], // Neutral
    COLORS.positive.DEFAULT, // Green
  ],

  // For showing sequential data like time series
  sequential: [
    COLORS.primary.light, // Light primary
    COLORS.primary.DEFAULT, // Primary
    COLORS.primary.dark, // Dark primary
  ],

  // Default palette for most charts (alias for categorical)
  default: [
    COLORS.primary.DEFAULT, // Primary
    COLORS.secondary.DEFAULT, // Secondary
    COLORS.primary.dark, // Primary Dark
    COLORS.secondary.dark, // Secondary Dark
    COLORS.primary.light, // Primary Light
    COLORS.secondary.light, // Secondary Light
  ],
};
