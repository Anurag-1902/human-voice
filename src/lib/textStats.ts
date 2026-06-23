export interface TextStats {
  words: number;
  chars: number;
  sentences: number;
  readingSeconds: number;
}

export function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function charCount(text: string): number {
  return text.length;
}

export function getTextStats(text: string): TextStats {
  const words = wordCount(text);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 3).length;
  // ~200 wpm average reading speed
  const readingSeconds = Math.round((words / 200) * 60);
  return { words, chars: charCount(text), sentences, readingSeconds };
}

export function formatReadingTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s read`;
  const minutes = Math.round(seconds / 60);
  return `${minutes} min read`;
}
