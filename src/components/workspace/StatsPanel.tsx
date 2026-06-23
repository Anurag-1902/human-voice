import { TrendingDown, Type, AlignLeft, Clock } from "lucide-react";
import { getTextStats, formatReadingTime } from "@/lib/textStats";
import { humanScore } from "@/lib/aiScore";
import type { AiScoreResult } from "@/lib/aiScore";

interface StatsPanelProps {
  inputText: string;
  outputText: string;
  inputScore: AiScoreResult | null;
  outputScore: AiScoreResult | null;
}

export function StatsPanel({ inputText, outputText, inputScore, outputScore }: StatsPanelProps) {
  const stats = getTextStats(outputText);

  const humanBefore = inputScore ? humanScore(inputScore.score) : null;
  const humanAfter = outputScore ? humanScore(outputScore.score) : null;
  const delta = humanBefore !== null && humanAfter !== null ? humanAfter - humanBefore : null;

  const items = [
    {
      icon: Type,
      label: "Words",
      value: stats.words.toLocaleString(),
    },
    {
      icon: AlignLeft,
      label: "Sentences",
      value: stats.sentences.toString(),
    },
    {
      icon: Clock,
      label: "Read time",
      value: formatReadingTime(stats.readingSeconds),
    },
    {
      icon: TrendingDown,
      label: "Human gain",
      value: delta !== null ? `${delta >= 0 ? "+" : ""}${delta}%` : "—",
      highlight: delta !== null && delta > 0,
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 text-muted-foreground">
            <item.icon className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
          </div>
          <div
            className={`mt-2 font-display text-2xl tabular-nums ${
              item.highlight ? "text-signal-good" : "text-foreground"
            }`}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
