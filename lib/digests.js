import "server-only";

import { buildInsightsSnapshot } from "./insights.js";

export async function buildWeeklyDigest() {
  const insights = await buildInsightsSnapshot();
  const themes = insights.themes.slice(0, 5).map((theme) => theme.term);
  const emotions = insights.emotions.slice(0, 5).map((emotion) => emotion.term);

  return {
    digest_type: "weekly",
    generated_by: "local-weekly-digest-v1",
    body:
      insights.entry_count === 0
        ? "No entries are available for this week yet."
        : `This week has ${insights.entry_count} indexed entries. Main themes: ${themes.join(", ") || "none yet"}. Emotional signals: ${emotions.join(", ") || "none detected"}.`,
    source_summary: {
      entry_count: insights.entry_count,
      themes,
      emotions,
    },
  };
}
