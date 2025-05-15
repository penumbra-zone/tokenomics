"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  start?: number;
  duration?: number; // ms
  format?: (value: number) => string;
  className?: string;
}

/**
 * AnimatedNumber animates a number from start to value on mount.
 * @param value Target value to animate to
 * @param start Start value (default 0)
 * @param duration Animation duration in ms (default 1200)
 * @param format Optional formatting function
 * @param className Optional className for styling
 */
export default function AnimatedNumber({
  value,
  start = 0,
  duration = 1200,
  format,
  className = "",
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(start);
  const raf = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    // If value changes, animate from current display
    let from = display;
    if (prevValue.current !== value) {
      from = prevValue.current;
      prevValue.current = value;
    }
    if (from === value) {
      setDisplay(value);
      return;
    }
    startTime.current = null;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const current = from + (value - from) * easeOutCubic(progress);
      setDisplay(current);
      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    };
    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  // Easing function for smooth animation
  function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }

  return (
    <span className={className}>
      {format ? format(display) : display.toLocaleString(undefined, { maximumFractionDigits: 2 })}
    </span>
  );
}
