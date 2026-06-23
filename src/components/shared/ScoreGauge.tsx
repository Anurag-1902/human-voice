import { useEffect, useState } from "react";
import { scoreTier, type ScoreTier } from "@/lib/aiScore";

const TIER_COLOR: Record<ScoreTier, string> = {
  good: "hsl(var(--signal-good))",
  warn: "hsl(var(--signal-warn))",
  bad: "hsl(var(--signal-bad))",
};

interface ScoreGaugeProps {
  /** Human-ness percentage 0–100 (100 = very human). */
  value: number;
  /** The underlying AI score, used only to pick the tier colour. */
  aiScore: number;
  size?: number;
  stroke?: number;
  label?: string;
  animate?: boolean;
}

/**
 * Circular gauge that visualises how human the text reads. Colour is driven by
 * the same tiering as the original ScoreBadge so semantics stay consistent.
 */
export function ScoreGauge({
  value,
  aiScore,
  size = 132,
  stroke = 10,
  label,
  animate = true,
}: ScoreGaugeProps) {
  const [display, setDisplay] = useState(animate ? 0 : value);
  const tier = scoreTier(aiScore);
  const color = TIER_COLOR[tier];

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (display / 100) * circumference;

  useEffect(() => {
    if (!animate) {
      setDisplay(value);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const from = display;
    const duration = 700;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (value - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, animate]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke 300ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl leading-none text-foreground tabular-nums">
          {Math.round(display)}%
        </span>
        {label && (
          <span className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
