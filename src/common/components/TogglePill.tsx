"use client";

import React from "react";

interface TogglePillProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TogglePill: React.FC<TogglePillProps> = ({ options, value, onChange, className }) => (
  <div className={`flex rounded-lg overflow-hidden border ${className ?? ""}`}>
    {options.map((opt, idx) => (
      <button
        key={opt.value}
        className={`px-4 py-1 text-xs font-medium transition-colors focus:outline-none ${
          value === opt.value
            ? "bg-primary text-white border-primary"
            : "border-neutral-200 text-muted-foreground"
        }`}
        onClick={() => onChange(opt.value)}
        style={idx !== options.length - 1 ? { borderRight: "1px solid transparent" } : undefined}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export default TogglePill;
