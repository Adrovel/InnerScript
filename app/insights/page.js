import Link from "next/link";
import { buildInsightsSnapshot } from "@/lib/insights";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const insights = await buildInsightsSnapshot();

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-on-background">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-primary">Back to journal</Link>
        <h1 className="mt-6 text-3xl font-semibold">Insights</h1>
        <p className="mt-4 text-sm text-on-surface-variant">{insights.entry_count} entries indexed locally.</p>
        <section className="mt-8">
          <h2 className="text-lg font-medium">Emotions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {insights.emotions.map((emotion) => (
              <span key={emotion.term} className="rounded-full bg-surface-container-low px-3 py-1 text-sm">{emotion.term} · {emotion.count}</span>
            ))}
          </div>
        </section>
        <section className="mt-8">
          <h2 className="text-lg font-medium">Themes</h2>
          <div className="mt-3 space-y-2">
            {insights.themes.map((theme) => (
              <div key={theme.term} className="border-b border-surface-variant/20 pb-2 text-sm">{theme.term} · {theme.count}</div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
