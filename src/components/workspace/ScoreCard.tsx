import { ShieldCheck, AlertTriangle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { ScoreGauge } from "@/components/shared/ScoreGauge";
import { humanScore, scoreLabel, scoreTier, type AiScoreResult } from "@/lib/aiScore";

const TIER_TEXT = {
  good: "text-signal-good",
  warn: "text-signal-warn",
  bad: "text-signal-bad",
} as const;

const TIER_BG = {
  good: "border-signal-good/30 bg-signal-good/[0.06]",
  warn: "border-signal-warn/30 bg-signal-warn/[0.06]",
  bad: "border-signal-bad/30 bg-signal-bad/[0.06]",
} as const;

export function ScoreCard({ result }: { result: AiScoreResult }) {
  const [open, setOpen] = useState(true);
  const tier = scoreTier(result.score);
  const human = humanScore(result.score);

  return (
    <div className={`mt-4 animate-scale-in rounded-2xl border p-4 ${TIER_BG[tier]}`}>
      <div className="flex items-center gap-4">
        <ScoreGauge value={human} aiScore={result.score} size={96} stroke={8} label="Human" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {tier === "good" ? (
              <ShieldCheck className={`h-4 w-4 ${TIER_TEXT[tier]}`} />
            ) : (
              <AlertTriangle className={`h-4 w-4 ${TIER_TEXT[tier]}`} />
            )}
            <span className={`text-sm font-semibold uppercase tracking-wide ${TIER_TEXT[tier]}`}>
              {scoreLabel(result.score)}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            AI signal {result.score}% · {result.flags.length} pattern{result.flags.length === 1 ? "" : "s"} checked
          </p>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-foreground/70 transition-colors hover:text-foreground"
            aria-expanded={open}
          >
            {open ? "Hide" : "Show"} details
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <ul className="mt-3 space-y-1.5 border-t border-border/60 pt-3">
          {result.flags.map((flag, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${result.score <= 15 ? "bg-signal-good" : "bg-current"}`} />
              {flag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
