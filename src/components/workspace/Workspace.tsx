import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { ControlsBar } from "@/components/workspace/ControlsBar";
import { EditorPane, SAMPLE_TEXT } from "@/components/workspace/EditorPane";
import { OutputPane } from "@/components/workspace/OutputPane";
import { ActionBar } from "@/components/workspace/ActionBar";
import { StatsPanel } from "@/components/workspace/StatsPanel";
import { useHumanizer, type TonePreset } from "@/hooks/useHumanizer";
import { computeAiScore, type AiScoreResult } from "@/lib/aiScore";

export function Workspace() {
  const { isProcessing, humanize, rehumanize } = useHumanizer();

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [condense, setCondense] = useState(false);
  const [tone, setTone] = useState<TonePreset>("casual");
  const [inputScore, setInputScore] = useState<AiScoreResult | null>(null);
  const [outputScore, setOutputScore] = useState<AiScoreResult | null>(null);

  // ── Humanize (same contract as original) ────────────────
  const handleHumanize = useCallback(async () => {
    if (!inputText.trim()) {
      toast.error("Please paste some text first.");
      return;
    }
    setInputScore(null);
    setOutputScore(null);
    const outcome = await humanize({ text: inputText, condense, tone });
    if (!outcome.ok) {
      toast.error(outcome.error ?? "Failed to humanize text. Please try again.");
      return;
    }
    const result = outcome.result ?? "No output received.";
    setOutputText(result);
    setInputScore(computeAiScore(inputText));
    setOutputScore(computeAiScore(result));
    toast.success("Humanized!");
  }, [inputText, condense, tone, humanize]);

  // ── Re-humanize (passes detectedIssues, same as original) ─
  const handleRehumanize = useCallback(async () => {
    if (!outputText.trim()) return;
    setOutputScore(null);
    const outcome = await rehumanize(outputText, tone);
    if (!outcome.ok) {
      toast.error(outcome.error ?? "Failed to re-humanize.");
      return;
    }
    const result = outcome.result ?? outputText;
    setOutputText(result);
    setOutputScore(computeAiScore(result));
    toast.success("Re-humanized!");
  }, [outputText, tone, rehumanize]);

  const handleCheckScore = useCallback(
    (which: "input" | "output") => {
      const text = which === "input" ? inputText : outputText;
      if (!text.trim()) {
        toast.error("No text to analyze.");
        return;
      }
      const result = computeAiScore(text);
      if (which === "input") setInputScore(result);
      else setOutputScore(result);
    },
    [inputText, outputText],
  );

  const handleCopy = useCallback(async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, [outputText]);

  const handleExport = useCallback(() => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "humanized.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded humanized.txt");
  }, [outputText]);

  const handleClear = useCallback(() => {
    setInputText("");
    setOutputText("");
    setInputScore(null);
    setOutputScore(null);
  }, []);

  const handleLoadSample = useCallback(() => {
    setInputText(SAMPLE_TEXT);
    setInputScore(null);
    setOutputScore(null);
  }, []);

  // ── Keyboard shortcut: ⌘/Ctrl + Enter to humanize ───────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (!isProcessing && inputText.trim()) handleHumanize();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isProcessing, inputText, handleHumanize]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <WorkspaceHeader />

      <main className="container flex-1 py-8">
        {/* Intro */}
        <div className="mx-auto mb-7 max-w-2xl text-center">
          <h1 className="font-display text-4xl font-normal tracking-tight text-foreground sm:text-5xl">
            Text <em className="text-gradient-primary not-italic">Humanizer</em>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Transform robotic AI text into natural, human writing — facts kept exactly as written.
          </p>
        </div>

        {/* Controls */}
        <div className="mx-auto mb-6 max-w-md">
          <ControlsBar
            tone={tone}
            onToneChange={setTone}
            condense={condense}
            onCondenseChange={setCondense}
            disabled={isProcessing}
          />
        </div>

        {/* Editor + Output */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <EditorPane
            value={inputText}
            onChange={(v) => {
              setInputText(v);
              setInputScore(null);
            }}
            onScore={() => handleCheckScore("input")}
            onLoadSample={handleLoadSample}
            onClear={handleClear}
            score={inputScore}
            disabled={isProcessing}
          />
          <OutputPane
            value={outputText}
            isProcessing={isProcessing}
            copied={copied}
            onScore={() => handleCheckScore("output")}
            onCopy={handleCopy}
            onExport={handleExport}
            score={outputScore}
          />
        </div>

        {/* Analytics */}
        {outputText && !isProcessing && (
          <StatsPanel
            inputText={inputText}
            outputText={outputText}
            inputScore={inputScore}
            outputScore={outputScore}
          />
        )}
      </main>

      <ActionBar
        isProcessing={isProcessing}
        canHumanize={!!inputText.trim()}
        hasOutput={!!outputText}
        canClear={!!inputText || !!outputText}
        onHumanize={handleHumanize}
        onRehumanize={handleRehumanize}
        onClear={handleClear}
      />
    </div>
  );
}
