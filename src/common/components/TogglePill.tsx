"use client";

import { defaultThemeColors, ThemeColors } from "@/common/styles/themeColors";
import React from "react";

interface TogglePillProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  themeColors?: ThemeColors;
}

const TogglePill: React.FC<TogglePillProps> = ({
  options,
  value,
  onChange,
  className,
  themeColors = defaultThemeColors,
}) => (
  <div className={`flex rounded-lg overflow-hidden border ${className ?? ""}`}>
    {options.map((opt, idx) => (
      <button
        key={opt.value}
        className={`px-4 py-1 text-xs font-medium transition-colors focus:outline-none`}
        style={{
          backgroundColor: value === opt.value ? themeColors.primary.value.DEFAULT : "transparent",
          color: value === opt.value ? "#ffffff" : themeColors.textSecondary.value,
          borderColor:
            value === opt.value
              ? themeColors.primary.value.DEFAULT
              : themeColors.textSecondary.value,
          borderRight:
            idx !== options.length - 1 ? `1px solid ${themeColors.textSecondary.value}40` : "none",
        }}
        onClick={() => onChange(opt.value)}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export default TogglePill;
