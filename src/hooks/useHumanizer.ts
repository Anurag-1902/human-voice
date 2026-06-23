import { useCallback, useState } from "react";
import { computeAiScore, type AiScoreResult } from "@/lib/aiScore";

export type TonePreset = "casual" | "professional" | "academic" | "creative";

export const TONE_LABELS: Record<TonePreset, { label: string; emoji: string; hint: string }> = {
  casual: { label: "Casual", emoji: "💬", hint: "Texting a smart friend" },
  professional: { label: "Professional", emoji: "💼", hint: "Clear internal memo" },
  academic: { label: "Academic", emoji: "🎓", hint: "Peer-review draft" },
  creative: { label: "Creative", emoji: "🎨", hint: "Literary essayist" },
};

export interface HumanizeArgs {
  text: string;
  condense: boolean;
  tone: TonePreset;
}

export interface HumanizeOutcome {
  ok: boolean;
  result?: string;
  error?: string;
}

/**
 * Calls the /api/humanize serverless function (Vercel + Gemini).
 * Request bodies are unchanged from the original:
 *   - humanize:    { text, condense, tone }
 *   - re-humanize: { text, condense: false, tone, detectedIssues }
 * The function responds with { result } on success or { error } on failure.
 */
async function callHumanize(body: Record<string, unknown>, fallback: string): Promise<HumanizeOutcome> {
  try {
    const res = await fetch("/api/humanize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let data: { result?: string; error?: string } = {};
    try {
      data = await res.json();
    } catch {
      /* non-JSON response */
    }

    if (!res.ok || data.error) {
      return { ok: false, error: data.error || fallback };
    }
    return { ok: true, result: data.result };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : fallback;
    return { ok: false, error: message };
  }
}

export function useHumanizer() {
  const [isProcessing, setIsProcessing] = useState(false);

  const humanize = useCallback(async ({ text, condense, tone }: HumanizeArgs): Promise<HumanizeOutcome> => {
    setIsProcessing(true);
    try {
      const outcome = await callHumanize({ text, condense, tone }, "Failed to humanize text. Please try again.");
      if (outcome.ok && !outcome.result) {
        return { ok: true, result: "No output received." };
      }
      return outcome;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const rehumanize = useCallback(async (text: string, tone: TonePreset): Promise<HumanizeOutcome> => {
    setIsProcessing(true);
    // Compute current score to pass detected issues to the AI (same as original).
    const currentScore = computeAiScore(text);
    try {
      const outcome = await callHumanize(
        { text, condense: false, tone, detectedIssues: currentScore.flags },
        "Failed to re-humanize.",
      );
      if (outcome.ok && !outcome.result) {
        return { ok: true, result: text };
      }
      return outcome;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { isProcessing, humanize, rehumanize };
}

export type { AiScoreResult };
