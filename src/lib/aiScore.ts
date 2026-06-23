/**
 * Client-side heuristic AI-detection scorer.
 *
 * IMPORTANT: This logic is preserved verbatim from the original
 * implementation. It is the product's core "human score" business logic and
 * must not change behaviour — it was only extracted from the component into a
 * dedicated module for reuse and testability.
 */

export interface AiScoreResult {
  score: number;
  flags: string[];
}

// ── AI-tell vocabulary ─────────────────────────────────────
const AI_TELL_WORDS = [
  "crucial", "vital", "moreover", "furthermore", "in conclusion", "it is important to note",
  "landscape", "realm", "in today's", "delve", "comprehensive", "robust", "leverage", "utilize",
  "facilitate", "multifaceted", "paradigm", "synergy", "cutting-edge", "game-changer", "unlock",
  "empower", "elevate", "streamline", "foster", "harness", "navigate", "pivotal", "transform",
  "revolutionize", "therefore", "consequently", "significantly", "notably", "essentially",
  "undeniably", "remarkably", "underscores", "underscored", "underscore", "tapestry", "beacon",
  "bustling", "intricate", "testament", "embracing", "spearheading", "groundbreaking",
  "ensuring", "enhancing", "optimizing", "thereby", "thus", "hence", "overall", "additionally",
  "ultimately", "plays a role", "serves as", "aims to", "seeks to", "is poised to",
  "it's worth noting", "at the end of the day", "in light of", "with that said",
  "moving forward", "on the other hand", "as a result", "in order to", "it goes without saying",
  "needless to say", "when it comes to", "at its core", "in essence", "by and large",
  "for the most part", "in the grand scheme", "without a doubt", "stands as", "remains a",
  "offers a", "provides a", "represents a", "constitutes a", "demonstrates", "illustrates",
  "highlights", "encompasses", "prioritize", "cornerstone", "instrumental", "indispensable",
  "noteworthy", "substantial", "profound", "seamless", "diverse", "dynamic", "innovative",
  "compelling", "arguably", "inherently", "fundamentally", "increasingly", "particularly",
  "specifically", "respectively",
];

const AI_TRANSITION_PHRASES = [
  "this means that", "this ensures that", "this allows", "this enables",
  "this highlights", "this demonstrates", "this illustrates", "this suggests",
  "it is clear that", "it is evident", "it is worth", "it should be noted",
  "one of the most", "one of the key", "in this context", "in this regard",
  "as mentioned", "as discussed", "as noted", "as highlighted",
  "not only", "but also", "while also", "in addition to",
];

const AI_SENTENCE_PATTERNS = [
  /^(this|these|those|such|the) \w+ (is|are|was|were|has|have|can|will|provides?|offers?|ensures?|enables?|allows?|represents?|demonstrates?|highlights?|illustrates?|serves?)\b/i,
  /\b(by|through) \w+ing\b.*\b(and|while) \w+ing\b/i,
  /\b(both|not only)\b.*\b(and|but also)\b/i,
];

export function computeAiScore(text: string): AiScoreResult {
  if (!text.trim()) return { score: 0, flags: [] };
  const lower = text.toLowerCase();
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 3);
  const flags: string[] = [];
  let penalty = 0;

  // 1. AI-tell vocabulary
  const hits = AI_TELL_WORDS.filter((w) => lower.includes(w));
  if (hits.length > 0) {
    penalty += Math.min(hits.length * 5, 25);
    flags.push(`AI vocabulary: ${hits.slice(0, 4).join(", ")}${hits.length > 4 ? ` (+${hits.length - 4} more)` : ""}`);
  }

  // 2. AI transition phrases
  const transHits = AI_TRANSITION_PHRASES.filter((p) => lower.includes(p));
  if (transHits.length > 0) {
    penalty += Math.min(transHits.length * 5, 20);
    flags.push(`Formulaic transitions: ${transHits.slice(0, 3).join(", ")}`);
  }

  // 3. AI sentence patterns
  const patternMatches = sentences.filter((s) => AI_SENTENCE_PATTERNS.some((p) => p.test(s.trim())));
  if (patternMatches.length >= 2) {
    penalty += Math.min(patternMatches.length * 4, 16);
    flags.push("Templated sentence structures");
  }

  // 4. Contraction rate
  const contractionCount = (text.match(/\b\w+'\w+/g) || []).length;
  const contractionRate = contractionCount / Math.max(sentences.length, 1);
  if (contractionRate < 0.1 && sentences.length > 3) {
    penalty += 14;
    flags.push("Very low contraction usage");
  } else if (contractionRate < 0.2 && sentences.length > 3) {
    penalty += 7;
    flags.push("Low contraction usage");
  }

  // 5. Sentence length uniformity
  if (sentences.length >= 4) {
    const lengths = sentences.map((s) => s.trim().split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((a, l) => a + (l - avg) ** 2, 0) / lengths.length;
    const cv = Math.sqrt(variance) / Math.max(avg, 1);
    if (cv < 0.25) { penalty += 14; flags.push("Very uniform sentence lengths"); }
    else if (cv < 0.35) { penalty += 7; flags.push("Somewhat uniform sentence lengths"); }

    // Check for lack of short sentences (fragments)
    const shortSentences = lengths.filter((l) => l <= 5);
    if (shortSentences.length === 0 && sentences.length > 5) {
      penalty += 6;
      flags.push("No short sentence fragments");
    }
  }

  // 6. Repeated sentence openers
  if (sentences.length >= 4) {
    const openers = sentences.map((s) => s.trim().split(/\s+/)[0]?.toLowerCase());
    const openerCounts: Record<string, number> = {};
    openers.forEach((o) => { if (o) openerCounts[o] = (openerCounts[o] || 0) + 1; });
    const maxRepeat = Math.max(...Object.values(openerCounts), 0);
    if (maxRepeat / sentences.length > 0.35) { penalty += 10; flags.push("Repeated sentence openers"); }

    // Check two-word opener repetition
    const twoWordOpeners = sentences.map((s) => s.trim().split(/\s+/).slice(0, 2).join(" ").toLowerCase());
    const twoWordCounts: Record<string, number> = {};
    twoWordOpeners.forEach((o) => { if (o) twoWordCounts[o] = (twoWordCounts[o] || 0) + 1; });
    const maxTwoRepeat = Math.max(...Object.values(twoWordCounts), 0);
    if (maxTwoRepeat >= 3) { penalty += 8; flags.push("Repeated two-word openers"); }
  }

  // 7. Paragraph uniformity
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim());
  if (paragraphs.length >= 3) {
    const pLens = paragraphs.map((p) => p.trim().split(/\s+/).length);
    const pAvg = pLens.reduce((a, b) => a + b, 0) / pLens.length;
    const pVariance = pLens.reduce((a, l) => a + (l - pAvg) ** 2, 0) / pLens.length;
    const pCv = Math.sqrt(pVariance) / Math.max(pAvg, 1);
    if (pCv < 0.2) { penalty += 8; flags.push("Very uniform paragraph lengths"); }
  }

  // 8. No informal markers
  const informalMarkers = (text.match(/—|\.\.\.|\(.*?\)|^(And|But|So|Yet|Or)\b/gm) || []).length;
  if (informalMarkers === 0 && sentences.length > 4) { penalty += 8; flags.push("No informal markers (dashes, ellipses, parentheticals)"); }

  // 9. Triple adjective lists
  const tripleAdj = (text.match(/\b\w+,\s+\w+,\s+and\s+\w+\b/gi) || []).length;
  if (tripleAdj >= 2) { penalty += 6; flags.push("Multiple three-adjective lists"); }

  // 10. Overly formal / passive voice density
  const passiveMatches = (text.match(/\b(is|are|was|were|been|being)\s+\w+ed\b/gi) || []).length;
  const passiveRate = passiveMatches / Math.max(sentences.length, 1);
  if (passiveRate > 0.4 && sentences.length > 3) { penalty += 8; flags.push("High passive voice density"); }

  // 11. "This [noun]" opener pattern (very common AI pattern)
  const thisNounOpeners = sentences.filter((s) => /^\s*(this|these)\s+(approach|method|process|technique|strategy|framework|model|system|concept|idea|principle|practice|initiative|effort|development|trend|shift|change|evolution|growth|expansion)/i.test(s.trim()));
  if (thisNounOpeners.length >= 2) { penalty += 8; flags.push('"This [noun]" sentence pattern'); }

  // 12. Excessive hedging or boosting
  const hedgeBoosters = (lower.match(/\b(extremely|incredibly|highly|deeply|truly|absolutely|completely|entirely|perfectly|clearly|obviously|certainly|definitely|surely|indeed|simply|merely|vastly|immensely|tremendously)\b/g) || []).length;
  if (hedgeBoosters >= 3) { penalty += Math.min(hedgeBoosters * 3, 12); flags.push("Excessive intensifiers/boosters"); }

  // 13. Colon-introduced lists in prose
  const colonLists = (text.match(/:\s*\n?\s*[-•]\s/g) || []).length;
  const colonIntroductions = (text.match(/:\s+(the|a|an|this|these|it|they|we|one|first|second|third|1|2|3)/gi) || []).length;
  if (colonLists >= 1 || colonIntroductions >= 3) { penalty += 6; flags.push("List-like structural pattern"); }

  if (flags.length === 0) flags.push("No obvious AI patterns detected");
  return { score: Math.min(Math.max(penalty, 0), 100), flags };
}

/** Human-ness is the inverse of the AI score. */
export function humanScore(aiScore: number): number {
  return Math.min(Math.max(100 - aiScore, 0), 100);
}

export function scoreLabel(score: number): string {
  if (score <= 15) return "Very Human";
  if (score <= 30) return "Mostly Human";
  if (score <= 50) return "Mixed";
  if (score <= 70) return "Likely AI";
  return "Strong AI Signal";
}

export type ScoreTier = "good" | "warn" | "bad";

export function scoreTier(score: number): ScoreTier {
  if (score <= 15) return "good";
  if (score <= 40) return "warn";
  return "bad";
}
