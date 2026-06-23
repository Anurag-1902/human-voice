import { ShieldCheck, Copy, Check, Download, Sparkles } from "lucide-react";
import { ScoreCard } from "@/components/workspace/ScoreCard";
import type { AiScoreResult } from "@/lib/aiScore";
import { wordCount, charCount } from "@/lib/textStats";

interface OutputPaneProps {
  value: string;
  isProcessing: boolean;
  copied: boolean;
  onScore: () => void;
  onCopy: () => void;
  onExport: () => void;
  score: AiScoreResult | null;
}

function LoadingState() {
  return (
    <div className="flex h-full min-h-[320px] flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center gap-2 text-sm text-primary">
        <Sparkles className="h-4 w-4 animate-pulse" />
        <span className="font-medium">Rewriting in two passes…</span>
      </div>
      <div className="mt-2 space-y-3">
        {[100, 92, 96, 70, 88, 60].map((w, i) => (
          <div
            key={i}
            className="relative h-3.5 overflow-hidden rounded-full bg-muted"
            style={{ width: `${w}%` }}
          >
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Sparkles className="h-6 w-6" />
      </div>
      <p className="mt-4 font-display text-xl text-foreground">Your humanized text appears here</p>
      <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
        Paste a draft on the left, pick a tone, and hit Humanize. Facts stay put — only the voice changes.
      </p>
    </div>
  );
}

export function OutputPane({ value, isProcessing, copied, onScore, onCopy, onExport, score }: OutputPaneProps) {
  return (
    <section className="flex flex-col">
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Humanized</label>
        <div className="flex items-center gap-3">
          {value && !isProcessing && (
            <>
              <button
                type="button"
                onClick={onScore}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Score
              </button>
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {wordCount(value)}w · {charCount(value)}c
              </span>
            </>
          )}
        </div>
      </div>

      {isProcessing ? (
        <LoadingState />
      ) : value ? (
        <div className="flex-1">
          <div className="relative">
            <div className="min-h-[320px] w-full whitespace-pre-wrap rounded-2xl border border-border bg-card p-5 text-[15px] leading-[1.75] text-card-foreground shadow-card">
              {value}
            </div>
            <div className="absolute right-3 top-3 flex gap-1.5">
              <button
                type="button"
                onClick={onCopy}
                aria-label="Copy output"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-background/80 px-2.5 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-signal-good" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={onExport}
                aria-label="Download as text file"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState />
      )}

      {score && !isProcessing && <ScoreCard result={score} />}
    </section>
  );
}
