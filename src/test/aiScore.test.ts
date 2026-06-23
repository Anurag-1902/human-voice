import { describe, it, expect } from "vitest";
import { computeAiScore, humanScore, scoreTier, scoreLabel } from "@/lib/aiScore";

describe("computeAiScore (preserved business logic)", () => {
  it("returns 0 with no flags for empty input", () => {
    const result = computeAiScore("");
    expect(result.score).toBe(0);
    expect(result.flags).toEqual([]);
  });

  it("flags AI-tell vocabulary and scores it higher", () => {
    const aiText =
      "Moreover, this comprehensive approach leverages cutting-edge methodologies to significantly enhance outcomes. Furthermore, it facilitates a robust, multifaceted framework. It is important to note that this ultimately transforms results.";
    const result = computeAiScore(aiText);
    expect(result.score).toBeGreaterThan(20);
    expect(result.flags.join(" ")).toMatch(/AI vocabulary/i);
  });

  it("scores natural human text lower than robotic text", () => {
    const human =
      "And here's the thing. A few small tweaks do most of the work. It reads like a person now — not a press release. Honestly? That's the whole point.";
    const robotic =
      "Moreover, this comprehensive framework leverages robust methodologies. Furthermore, it significantly enhances multifaceted outcomes. Consequently, it ultimately facilitates transformation.";
    expect(computeAiScore(human).score).toBeLessThan(computeAiScore(robotic).score);
  });

  it("caps the score at 100", () => {
    const result = computeAiScore("crucial vital moreover furthermore comprehensive robust leverage utilize".repeat(20));
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("derives human-ness as the inverse of the AI score", () => {
    expect(humanScore(0)).toBe(100);
    expect(humanScore(70)).toBe(30);
    expect(humanScore(120)).toBe(0);
  });

  it("maps tiers and labels consistently", () => {
    expect(scoreTier(10)).toBe("good");
    expect(scoreTier(30)).toBe("warn");
    expect(scoreTier(80)).toBe("bad");
    expect(scoreLabel(10)).toBe("Very Human");
    expect(scoreLabel(80)).toBe("Strong AI Signal");
  });
});
