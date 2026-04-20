"use client";

import React, { useEffect, useState } from "react";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  format?: (value: number) => string;
}

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 2000,
  decimals = 0,
  prefix = "",
  suffix = "",
  format,
}: AnimatedCounterProps) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (from === to) {
      setValue(to);
      return;
    }

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const newValue = from + (to - from) * progress;
      setValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [from, to, duration]);

  const displayValue = format
    ? format(value)
    : `${prefix}${value.toFixed(decimals)}${suffix}`;

  return <span className="tabular-nums font-bold">{displayValue}</span>;
}
