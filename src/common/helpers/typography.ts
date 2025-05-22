import { COLORS } from "./colors";

// Define Font Families
export const FONT_FAMILIES = {
  primary: "'Roboto', sans-serif",
  mono: "'Roboto Mono', monospace",
};

// Define Font Weights
export const FONT_WEIGHTS = {
  thin: 100,
  extraLight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
};

// Define Font Sizes (in rem for scalability)
export const FONT_SIZES = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "3.75rem", // 60px
  "7xl": "4.5rem", // 72px
  "8xl": "6rem", // 96px
  "9xl": "8rem", // 128px
};

// Define Line Heights
export const LINE_HEIGHTS = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
};

// Define Text Colors
export const TEXT_COLORS = {
  primary: COLORS.neutral[50],
  secondary: COLORS.neutral[400],
  tertiary: COLORS.neutral[500],
  disabled: COLORS.neutral[600],
  accent: COLORS.primary.DEFAULT,
  // destructive: COLORS.red[500], // Assuming a red color exists in your COLORS
  inherit: "inherit",
};

// Predefined Text Styles (examples)
export const TEXT_STYLES = {
  h1: {
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES["4xl"],
    lineHeight: LINE_HEIGHTS.tight,
    color: TEXT_COLORS.primary,
  },
  h2: {
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES["3xl"],
    lineHeight: LINE_HEIGHTS.tight,
    color: TEXT_COLORS.primary,
  },
  h3: {
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: FONT_WEIGHTS.semiBold,
    fontSize: FONT_SIZES["2xl"],
    lineHeight: LINE_HEIGHTS.snug,
    color: TEXT_COLORS.primary,
  },
  body: {
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: FONT_WEIGHTS.normal,
    fontSize: FONT_SIZES.base,
    lineHeight: LINE_HEIGHTS.normal,
    color: TEXT_COLORS.primary,
  },
  caption: {
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: FONT_WEIGHTS.normal,
    fontSize: FONT_SIZES.sm,
    lineHeight: LINE_HEIGHTS.normal,
    color: TEXT_COLORS.secondary,
  },
  button: {
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.base,
    lineHeight: LINE_HEIGHTS.none,
    color: TEXT_COLORS.primary, // Or a specific button text color
  },
};

// Utility function to apply text styles (optional, but can be handy)
// Example: style={getTextStyle('h1')}
export const getTextStyle = (styleName: keyof typeof TEXT_STYLES) => {
  return TEXT_STYLES[styleName];
}; 