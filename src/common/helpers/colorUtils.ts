/**
 * Color utility functions for converting between different color formats
 * and manipulating colors throughout the application.
 */

import { COLORS } from "./colors";

/**
 * Converts HSL color values to hexadecimal color code
 * @param h - Hue value (0-360)
 * @param s - Saturation value (0-100)
 * @param l - Lightness value (0-100)
 * @returns Hexadecimal color code (e.g. #ff5500)
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Converts hexadecimal color code to RGB values string for use in rgba()
 * @param hex - Hexadecimal color code (e.g. #ff5500)
 * @returns RGB values string (e.g. "255, 85, 0")
 */
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : "244, 156, 67"; // Fallback to orange
}

/**
 * Shifts the hue of a hexadecimal color by a specified amount
 * @param hexColor - Hexadecimal color code (e.g. #ff5500)
 * @param amount - Amount to shift the hue by in degrees (-180 to 180)
 * @returns Hexadecimal color code with shifted hue
 */
export function shiftHue(hexColor: string, amount: number): string {
  // Convert hex to RGB
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
  if (!result) return hexColor;

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  // RGB to HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }

    h /= 6;
  }

  // Adjust hue
  h = (h * 360 + amount) % 360;
  if (h < 0) h += 360;
  h /= 360;

  // HSL to RGB
  let r1, g1, b1;

  if (s === 0) {
    r1 = g1 = b1 = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r1 = hue2rgb(p, q, h + 1 / 3);
    g1 = hue2rgb(p, q, h);
    b1 = hue2rgb(p, q, h - 1 / 3);
  }

  // RGB to Hex
  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;
}

/**
 * Generates theme colors from CSS variables
 * @returns An object with primary color and gradient colors
 */
export function getPrimaryThemeColors() {
  const rootStyles = getComputedStyle(document.documentElement);
  const primaryHsl = rootStyles.getPropertyValue("--primary").trim();

  // Convert HSL values to hex
  const [h, s, l] = primaryHsl.split(" ").map((val) => parseFloat(val));
  const primaryColor = hslToHex(h, s, l);

  return {
    primaryColor,
    barGradient: COLORS.gradients.primaryBar,
    areaGradient: COLORS.gradients.primaryFade,
  };
}

/**
 * Extracts theme colors from CSS variables and generates variations
 * @returns An array of hex color strings
 */
export function getColorPalette(): string[] {
  const rootStyles = getComputedStyle(document.documentElement);
  const cssVars = [
    "--primary",
    "--secondary",
    "--destructive",
    "--accent",
    "--muted",
    "--card",
  ];

  // Get colors and convert from HSL to hex
  const colors = cssVars
    .map((variable) => {
      const hslValue = rootStyles.getPropertyValue(variable).trim();
      if (!hslValue) return "";

      try {
        const [h, s, l] = hslValue.split(" ").map((val) => parseFloat(val));
        return hslToHex(h, s, l);
      } catch (e) {
        return "";
      }
    })
    .filter(Boolean);

  // Add variations of primary and secondary
  if (colors.length >= 2) {
    const variations = [
      shiftHue(colors[0], 30), // Shift primary hue by 30 degrees
      shiftHue(colors[1], -30), // Shift secondary hue by -30 degrees
    ];

    return [...colors, ...variations];
  }
  
  // Fallback to predefined chart palette if CSS variables aren't available
  return colors.length > 0 ? colors : COLORS.charts.categorical;
} 