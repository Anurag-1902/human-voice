import { ShieldCheck, FileText, Eraser } from "lucide-react";
import { ScoreCard } from "@/components/workspace/ScoreCard";
import type { AiScoreResult } from "@/lib/aiScore";
import { wordCount, charCount } from "@/lib/textStats";

const SAMPLE_TEXT = `In today's rapidly evolving landscape, leveraging cutting-edge artificial intelligence has become crucial for businesses seeking to streamline operations. Moreover, this comprehensive approach facilitates a robust framework that significantly enhances productivity. It is important to note that organizations must navigate these multifaceted challenges thoughtfully. Furthermore, by embracing innovative methodologies, companies can foster sustainable growth and ultimately transform their competitive positioning in the market.`;

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
  onScore: () => void;
  onLoadSample: () => void;
  onClear: () => void;
  score: AiScoreResult | null;
  disabled?: boolean;
}

export function EditorPane({ value, onChange, onScore, onLoadSample, onClear, score, disabled }: EditorPaneProps) {
  const hasText = value.trim().length > 0;

  return (
    <section className="flex flex-col">
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        <label htmlFor="input-text" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Original
        </label>
        <div className="flex items-center gap-3">
          {hasText ? (
            <button
              type="button"
              onClick={onScore}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Score
            </button>
          ) : (
            <button
              type="button"
              onClick={onLoadSample}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              <FileText className="h-3.5 w-3.5" />
              Try a sample
            </button>
          )}
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {wordCount(value)}w · {charCount(value)}c
          </span>
        </div>
      </div>

      <div className="relative flex-1">
        <textarea
          id="input-text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Paste your AI-generated text here…  (⌘/Ctrl + Enter to humanize)"
          className="h-full min-h-[320px] w-full resize-none rounded-2xl border border-border bg-card p-5 text-[15px] leading-[1.75] text-card-foreground shadow-card transition-shadow placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/40 disabled:opacity-60"
        />
        {hasText && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear input"
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          >
            <Eraser className="h-4 w-4" />
          </button>
        )}
      </div>

      {score && <ScoreCard result={score} />}
    </section>
  );
}

export { SAMPLE_TEXT };
