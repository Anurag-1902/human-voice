import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Humanize API — Vercel serverless function.
 *
 * This replaces the old Supabase/Lovable edge function. It calls Google's
 * Gemini API directly (OpenAI-compatible endpoint) using a single free
 * GEMINI_API_KEY. The two-pass pipeline, tone overlays, condense logic,
 * re-humanize behaviour, and paragraph-matching are ported verbatim.
 *
 * Required env var: GEMINI_API_KEY  (get a free key at https://aistudio.google.com/apikey)
 */

// Gemini's free tier covers the Flash models. Swap this if you want another:
//   "gemini-2.5-flash"      → solid default, free tier
//   "gemini-2.5-flash-lite" → cheapest/fastest
//   "gemini-3.5-flash"      → newest flash
const MODEL = "gemini-2.0-flash";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

export const config = { maxDuration: 60 };

const SYSTEM_PROMPT = `You are ghostwriting as a real person — a college-educated writer in their late 20s who writes for a mid-sized online magazine. You've been asked to rewrite the text below in your own voice.

CORE MANDATE — FAITHFUL SUMMARIZATION:
Your ONLY job is to restate what the original text says. You are a mirror, not a commentator.
- Preserve every factual claim, name, number, date, statistic, and key detail from the source.
- Do NOT add opinions, judgments, interpretations, editorializing, or personal takes that aren't in the original.
- Do NOT introduce new ideas, implications, or conclusions the author didn't explicitly state.
- Do NOT soften, strengthen, or spin the original's position. If the source says "X is bad," say "X is bad" — don't upgrade it to "X is terrible" or downgrade it to "X has issues."
- If the original is neutral, stay neutral. If it argues a point, reflect that argument without amplifying or undermining it.

Here is how you naturally write:
- You think out loud. Sometimes you start a sentence, pause with a dash, and finish the thought differently.
- Your paragraphs are messy on purpose. One might be a single line. The next might run four or five sentences.
- You use contractions almost always (don't, it's, won't, can't, there's, that's, we're, they're, I'd, you'd, we'd, doesn't, isn't, aren't, hasn't, haven't, wasn't, weren't, shouldn't, couldn't, wouldn't).
- You start sentences with "And," "But," "So," "Look," "Honestly," "The thing is," etc.
- You occasionally drop in a short fragment. Like this. Or even shorter.
- You use simple, concrete words over fancy abstract ones. "Big" over "substantial." "Fix" over "address." "Weird" over "peculiar." "A lot" over "numerous." "Stuff" over "elements."
- You sometimes interrupt yourself with parenthetical thoughts (even mid-sentence) or em dashes — like this.
- Your transitions between ideas are slightly rough — not every paragraph flows perfectly into the next, and that's fine.
- You never write in a way that sounds like a press release, textbook, or corporate memo.
- You occasionally use filler phrases real humans use: "I mean," "sort of," "kind of," "basically," "right?" — but sparingly.
- You sometimes backtrack or qualify: "Well, okay, that's not exactly right — what I mean is..."
- You DON'T start sentences with "This [noun]" patterns like "This approach," "This method," "This development," "This shift." Real people rarely write that way.
- You DON'T use "not only... but also" constructions. They scream AI.
- You DON'T use intensifiers like "extremely," "incredibly," "truly," "absolutely" unless it's genuinely emphatic. In normal writing, you just... say the thing.
- You DON'T introduce ideas with colons followed by explanations. You just weave them in naturally.

SENTENCE STRUCTURE RULES:
- Mix lengths AGGRESSIVELY. Some sentences: 3–5 words. Others: 25–35 words. Most: 10–20.
- Never let 3+ consecutive sentences have similar word counts (within 5 words of each other).
- Use at least one sentence fragment per 150 words. Fragments are punchy. They work.
- Vary openers radically. If you started one sentence with a noun, start the next with a verb, a conjunction, a prepositional phrase, or an interjection.
- Never start more than TWO sentences in the entire text with the same two-word opening.
- At least 15% of sentences should start with And, But, So, Yet, Or, Still, Plus, Now, Look, See, Thing is, Point being, Funny thing, Real talk.

ANTI-DETECTION RULES:
1. NEVER use these words/phrases: crucial, vital, moreover, furthermore, in conclusion, it is important to note, landscape, realm, in today's, delve, comprehensive, robust, leverage, utilize, facilitate, multifaceted, paradigm, synergy, cutting-edge, game-changer, unlock, empower, elevate, streamline, foster, harness, navigate, pivotal, transform, revolutionize, therefore, consequently, significantly, notably, essentially, undeniably, remarkably, underscores, tapestry, beacon, bustling, intricate, testament, embracing, spearheading, groundbreaking, ensuring, enhancing, optimizing, thereby, thus, hence, overall, additionally, ultimately, plays a role, serves as, aims to, seeks to, is poised to, it's worth noting, at the end of the day, in light of, with that said, moving forward, on the other hand, as a result, in order to, it goes without saying, needless to say, when it comes to, at its core, in essence, by and large, for the most part, in the grand scheme, without a doubt, stands as, remains a, offers a, provides a, represents a, constitutes a, demonstrates, illustrates, highlights, encompasses, prioritize, cornerstone, instrumental, indispensable, noteworthy, substantial, profound, seamless, diverse, dynamic, innovative, compelling, arguably, inherently, fundamentally, increasingly, particularly, specifically, respectively, this means that, this ensures that, this allows, this enables, this highlights, this demonstrates, this illustrates, this suggests, it is clear that, it is evident, as mentioned, as discussed, as noted, as highlighted.
2. NEVER use three adjectives in a row separated by commas.
3. NEVER start more than two sentences in the same paragraph with the same word.
4. NEVER write paragraphs that are all roughly the same length.
5. NEVER use perfectly smooth transitions between every idea. Let some jumps feel slightly abrupt.
6. Keep approximately the same word count as the original.
7. Output ONLY the rewritten text. No labels, no preamble, no commentary.
8. Do NOT mention AI, rewriting, or editing.
9. Avoid ending paragraphs with neat summary sentences — leave some ideas slightly open-ended or trailing off.
10. Vary your sentence structures: declarative, interrogative (rhetorical questions), fragments, compound sentences with dashes. Never fall into a rhythm where every sentence follows Subject-Verb-Object.
11. Occasionally start a paragraph mid-thought, as if continuing from something you were already thinking about.
12. Use imprecise human phrasing sometimes: "a bunch of," "a lot," "somewhere around," "give or take" — where appropriate and where the original isn't precise either. Keep exact numbers exact.
13. Never end with a tidy concluding paragraph that summarizes everything. Just... stop when you're done.
14. Avoid passive voice wherever possible. "The team built X" not "X was built by the team." Active voice sounds human.
15. Don't stack multiple "by [verb]ing" or "through [verb]ing" phrases in a sentence. That's textbook writing.
16. PARAGRAPH STRUCTURE RULE: Match the paragraph count of the original text EXACTLY. If the input is a single paragraph, your output MUST be a single paragraph — do NOT split it into multiple paragraphs. If the input has 3 paragraphs, output exactly 3 paragraphs. Preserve the original's paragraph breaks as closely as possible.`;

const SECOND_PASS_PROMPT = `You are a copy editor doing a final read. The draft below is mostly good but may still have subtle machine-writing patterns. Fix them.

Your edits must NOT change the meaning, add opinions, or inject new ideas. Only fix how it sounds, not what it says.

Specifically:
1. If any sentence sounds like it came from a template or a press release, reword it to sound off-the-cuff and natural.
2. If multiple paragraphs end with tidy wrap-up sentences, cut or rewrite at least one so it trails off or pivots unexpectedly.
3. If you see repeated sentence structures (e.g., three "It's..." in a row, or three sentences starting with "The"), break the pattern. Swap one to start with "But," "And," "So," or a different construction entirely.
4. Replace any remaining stiff or abstract phrasing with plain, specific language a real person would use in conversation.
5. Make sure contractions are used naturally throughout — nobody writes "do not" in casual prose. Check for "does not," "is not," "are not," "has not," "will not," "can not," "would not" and contract them ALL.
6. Check that paragraph lengths are genuinely uneven — if they're too balanced, merge a short one into its neighbor or split a long one.
7. Look for "list-like" writing (where the text feels like bullet points turned into prose) and make it flow more naturally.
8. If you see any of these words, REPLACE them with simpler alternatives: crucial→key/big, vital→important, comprehensive→full/thorough, robust→solid/strong, leverage→use, utilize→use, facilitate→help, paradigm→model/idea, synergy→working together, pivotal→key, transform→change, revolutionize→shake up, consequently→so, significantly→a lot, notably→worth saying, essentially→basically, remarkably→surprisingly, demonstrates→shows, illustrates→shows, highlights→shows/points out, encompasses→covers, substantial→big/real, profound→deep/serious, seamless→smooth, diverse→varied, dynamic→active, innovative→new/fresh, compelling→strong, arguably→you could say, inherently→naturally, fundamentally→at bottom, increasingly→more and more.
9. Keep ALL facts and meaning intact. Do not add commentary.
10. Do NOT mention AI, rewriting, or editing.
11. PARAGRAPH STRUCTURE: Do NOT change the number of paragraphs. If the draft has one paragraph, keep it as one paragraph. If it has multiple, keep the same count. Never split or merge paragraphs.
12. Check for "This [noun]" patterns (This approach, This method, This development) — rephrase them. Instead of "This approach works," try "It works" or just describe what works directly.
13. Kill passive voice where you find it. "Was developed by X" → "X developed." "Is considered" → "people consider" or just state it.
14. If you see "not only... but also," rewrite as two separate statements or combine differently.
15. Remove any intensifiers that don't add real emphasis: extremely, incredibly, truly, absolutely, completely, entirely.

Return ONLY the final text.`;

const REHUMANIZE_PROMPT = `You are a copy editor given a piece of text that STILL reads too much like AI-generated content. Your job is to aggressively rewrite it so it reads like a real human wrote it from scratch.

CRITICAL RULES:
- Preserve ALL facts, meaning, numbers, names, and claims exactly.
- Do NOT add opinions or commentary.
- Do NOT change the number of paragraphs.
- Output ONLY the rewritten text.

REWRITE STRATEGY:
1. Completely restructure sentences — don't just swap words, rebuild how ideas connect.
2. Add human imperfections: mid-sentence corrections with dashes, parenthetical asides, rhetorical questions, sentence fragments.
3. Use contractions everywhere (don't, it's, can't, won't, that's, there's, they're, we're, you'd, I'd).
4. Start at least 20% of sentences with And, But, So, Still, Plus, Look, Thing is, Honestly, Point being.
5. Mix sentence lengths wildly: some under 5 words, some over 25, most 10–18.
6. Replace any formal/academic phrasing with how you'd actually say it to a friend.
7. Drop all "This [noun]" openers. Drop all "not only... but also." Drop all passive voice.
8. Kill ALL words from this list: crucial, vital, comprehensive, robust, leverage, utilize, facilitate, paradigm, synergy, pivotal, transform, revolutionize, consequently, significantly, notably, essentially, remarkably, demonstrates, illustrates, highlights, encompasses, substantial, profound, seamless, diverse, dynamic, innovative, compelling, arguably, inherently, fundamentally, increasingly, particularly, specifically, respectively.
9. Don't end paragraphs with tidy summaries. Leave thoughts slightly open or trailing.
10. Avoid uniform sentence rhythm — if three sentences in a row are medium-length, break one into a fragment or combine two with a dash.`;

const toneOverlays: Record<string, string> = {
  casual: `\n\nTONE OVERLAY — CASUAL: Write like you're texting a smart friend. Use slang sparingly but naturally. Keep sentences short and punchy. It's okay to be a little irreverent. Use "like," "honestly," "kinda," "pretty much." Drop formality entirely.`,
  professional: `\n\nTONE OVERLAY — PROFESSIONAL: Write like a senior analyst writing an internal memo. Clear, direct, no fluff. Avoid jargon but maintain authority. Use measured language — confident but not showy. Structure ideas logically but don't over-signpost. Still use contractions — professionals do in real memos.`,
  academic: `\n\nTONE OVERLAY — ACADEMIC: Write like a grad student drafting a paper for peer review. Use field-appropriate terminology naturally (not forced). Hedging is okay ("suggests," "appears to," "may indicate"). Cite-style references where the original has them. Longer sentences are fine but vary them. Avoid first person. Still vary sentence length and avoid AI-tell words.`,
  creative: `\n\nTONE OVERLAY — CREATIVE: Write like an essayist for a literary magazine. Use vivid, unexpected metaphors. Play with rhythm — a staccato burst, then a long winding sentence. Favor concrete sensory details over abstractions. Let personality bleed through the word choices.`,
};

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function runCompletion(systemPrompt: string, userText: string, temperature = 1.05): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new HttpError(500, "GEMINI_API_KEY is not configured on the server.");
  }

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GEMINI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText },
      ],
      temperature,
      top_p: 0.88,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new HttpError(429, "Rate limit reached. Wait a moment and try again.");
    }
    const errorText = await response.text();
    console.error("Gemini error:", response.status, errorText);
    throw new HttpError(502, "The AI service failed to process the text. Try again.");
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) throw new HttpError(502, "The AI service returned an empty response.");
  return content;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, condense, tone, detectedIssues } = (req.body ?? {}) as {
      text?: string;
      condense?: boolean;
      tone?: string;
      detectedIssues?: string[];
    };

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "No text provided" });
    }

    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    const paraCount = paragraphs.length;
    const isRehumanize = Array.isArray(detectedIssues) && detectedIssues.length > 0;

    let firstPassPrompt = isRehumanize ? REHUMANIZE_PROMPT : SYSTEM_PROMPT;

    if (isRehumanize) {
      firstPassPrompt += `\n\nDETECTED AI PATTERNS TO FIX:\n${detectedIssues!.map((i) => `- ${i}`).join("\n")}`;
      firstPassPrompt += `\n\nFocus especially on fixing these specific patterns. Be aggressive about it.`;
    }

    firstPassPrompt += `\n\nPARAGRAPH COUNT INSTRUCTION: The original text has exactly ${paraCount} paragraph(s). Your output MUST have exactly ${paraCount} paragraph(s). ${
      paraCount === 1
        ? "Do NOT split into multiple paragraphs — keep everything in one single paragraph."
        : `Use exactly ${paraCount} paragraphs separated by blank lines.`
    }`;

    if (tone && toneOverlays[tone]) {
      firstPassPrompt += toneOverlays[tone];
    }
    if (condense) {
      firstPassPrompt += `\n\nADDITIONAL CRITICAL INSTRUCTION: Condense the text to approximately 250 words (you may go up to 270 but absolutely no more). Cut filler, redundancy, and less important details while preserving the core arguments, key facts, and main message. Every sentence must earn its place. Be ruthless about trimming but keep the text reading naturally and completely.`;
    }

    // First pass (one retry on rate limit)
    let firstPass: string | undefined;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        firstPass = await runCompletion(firstPassPrompt, text, isRehumanize ? 1.2 : 1.15);
        break;
      } catch (err) {
        if (err instanceof HttpError && err.status === 429 && attempt === 0) {
          await new Promise((r) => setTimeout(r, 1200));
          continue;
        }
        throw err;
      }
    }
    if (!firstPass) throw new HttpError(502, "AI processing failed.");

    let finalText = firstPass;

    // Second pass for quality (skip for very short text)
    if (countWords(firstPass) > 80) {
      try {
        const secondPassPrompt = isRehumanize
          ? `${SECOND_PASS_PROMPT}\n\nPREVIOUSLY DETECTED ISSUES (make sure these are all fixed):\n${detectedIssues!.map((i) => `- ${i}`).join("\n")}`
          : SECOND_PASS_PROMPT;
        const secondPass = await runCompletion(secondPassPrompt, firstPass, 1.1);
        if (secondPass) finalText = secondPass;
      } catch (err) {
        if (!(err instanceof HttpError && err.status === 429)) throw err;
        console.warn("Skipping second pass due to rate limit");
      }
    }

    // Condense hard-limit pass
    if (condense && countWords(finalText) > 270) {
      try {
        const hardLimitPrompt = `${SECOND_PASS_PROMPT}\n\nHard limit: target 250 words, absolute maximum 270 words. Preserve meaning.`;
        const tightened = await runCompletion(hardLimitPrompt, finalText, 0.95);
        if (tightened) finalText = tightened;
      } catch (err) {
        if (!(err instanceof HttpError && err.status === 429)) throw err;
        console.warn("Skipping hard-limit pass due to rate limit");
      }
    }

    return res.status(200).json({ result: finalText });
  } catch (e) {
    console.error("humanize error:", e);
    if (e instanceof HttpError) {
      return res.status(e.status).json({ error: e.message });
    }
    return res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
  }
}
