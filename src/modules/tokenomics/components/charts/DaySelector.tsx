"use client";

interface DaySelectorProps {
  dayOptions?: number[];
  selectedDay: number;
  onDaysChange: (days: number) => void;
}

export default function DaySelector({
  dayOptions = [7, 30, 90],
  selectedDay,
  onDaysChange,
}: DaySelectorProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      {dayOptions.map((opt: number) => (
        <button
          key={opt}
          className={`px-2 py-1 rounded-xl text-xs font-medium border transition-colors text-neutral-50 ${
            selectedDay === opt
              ? "bg-primary border-primary"
              : "border-primary/40 hover:bg-primary/10"
          }`}
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
