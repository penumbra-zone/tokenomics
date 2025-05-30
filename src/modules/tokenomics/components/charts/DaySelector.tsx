"use client";

import { defaultThemeColors, ThemeColors } from "@/common/styles/themeColors";

interface DaySelectorProps {
  dayOptions?: number[];
  selectedDay: number;
  onDaysChange: (days: number) => void;
  themeColors?: ThemeColors;
}

export default function DaySelector({
  dayOptions = [7, 30, 90],
  selectedDay,
  onDaysChange,
  themeColors = defaultThemeColors,
}: DaySelectorProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      {dayOptions.map((opt: number) => (
        <button
          key={opt}
          className={`px-2 py-1 rounded-xl text-xs font-medium border transition-colors`}
          style={{
            color: themeColors.textPrimary.value,
            backgroundColor:
              selectedDay === opt ? themeColors.primary.value.DEFAULT : "transparent",
            borderColor:
              selectedDay === opt
                ? themeColors.primary.value.DEFAULT
                : `${themeColors.primary.value.DEFAULT}66`, // 40% opacity
          }}
          onMouseEnter={(e) => {
            if (selectedDay !== opt) {
              e.currentTarget.style.backgroundColor = `${themeColors.primary.value.DEFAULT}1A`; // 10% opacity
            }
          }}
          onMouseLeave={(e) => {
            if (selectedDay !== opt) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
          onClick={() => {
            onDaysChange(opt);
          }}
        >
          {opt}d
        </button>
      ))}
    </div>
  );
}
