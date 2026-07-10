import "server-only";

import { listEntries } from "./entries.js";
import { getSearchTerms } from "./chunking.js";

const EMOTION_TERMS = ["anxious", "angry", "sad", "grateful", "focused", "afraid", "stuck"];

export async function buildInsightsSnapshot() {
  const entries = await listEntries({ limit: 100 });
  const body = entries.map((entry) => entry.body).join("\n").toLowerCase();
  const terms = getSearchTerms(body);
  const termCounts = new Map();

  for (const term of terms) {
    termCounts.set(term, (termCounts.get(term) ?? 0) + 1);
  }

  const themes = [...termCounts.entries()]
    .filter(([term]) => term.length > 4 && !EMOTION_TERMS.includes(term))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([term, count]) => ({ term, count }));
  const emotions = EMOTION_TERMS
    .map((term) => ({ term, count: termCounts.get(term) ?? 0 }))
    .filter((item) => item.count > 0);

  return {
    entry_count: entries.length,
    emotions,
    themes,
    open_loops: themes.slice(0, 3).map((theme) => ({
      label: theme.term,
      source: "local-term-scan",
    })),
    generated_by: "local-insights-v1",
  };
}
