import { Sparkles, RefreshCw, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionBarProps {
  isProcessing: boolean;
  canHumanize: boolean;
  hasOutput: boolean;
  canClear: boolean;
  onHumanize: () => void;
  onRehumanize: () => void;
  onClear: () => void;
}

export function ActionBar({
  isProcessing,
  canHumanize,
  hasOutput,
  canClear,
  onHumanize,
  onRehumanize,
  onClear,
}: ActionBarProps) {
  return (
    <div className="sticky bottom-0 z-30 border-t border-border bg-background/85 backdrop-blur-xl">
      <div className="container flex flex-wrap items-center justify-center gap-3 py-4">
        <Button variant="outline" onClick={onClear} disabled={!canClear || isProcessing}>
          <RotateCcw />
          Clear
        </Button>

        <Button
          variant="hero"
          size="lg"
          onClick={onHumanize}
          disabled={isProcessing || !canHumanize}
          className={isProcessing ? "" : "animate-pulse-glow"}
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Sparkles />
              Humanize
            </>
          )}
        </Button>

        {hasOutput && (
          <Button variant="outline" onClick={onRehumanize} disabled={isProcessing}>
            <RefreshCw />
            Re-humanize
          </Button>
        )}
      </div>
    </div>
  );
}
