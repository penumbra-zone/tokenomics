import { COLORS } from '../helpers/colors';

export interface Color {
  DEFAULT: string;
  light: string;
  dark: string;
}

export type TextColor = string; 

export interface ColorValues {
  value: Color;
  cssVariable: string;
}

export interface TextColorValues {
  value: TextColor;
  cssVariable: string;
}

export interface ThemeColors {
  primary: ColorValues;
  secondary: ColorValues;
  textPrimary: TextColorValues;
  textSecondary: TextColorValues;
}

export const defaultThemeColors: ThemeColors = {
  primary: {
    value: COLORS.primary,
    cssVariable: "--color-primary",
  },
  secondary: {
    value: COLORS.secondary,
    cssVariable: "--color-secondary",
  },
  textPrimary: {
    value: COLORS.neutral[50],
    cssVariable: "--text-primary",
  },
  textSecondary: {
    value: COLORS.neutral[500],
    cssVariable: "--text-neutral-500",
  },
};

export const secondaryThemeColors: ThemeColors = {
  primary: {
    value: COLORS.secondary,
    cssVariable: "--color-secondary",
  },
  secondary: {
    value: COLORS.primary,
    cssVariable: "--color-primary",
  },
  textPrimary: {
    value: COLORS.neutral[50],
    cssVariable: "--text-primary",
  },
  textSecondary: {
    value: COLORS.neutral[500],
    cssVariable: "--text-neutral-500",
  },
};