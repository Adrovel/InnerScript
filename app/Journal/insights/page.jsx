import MoodTimelineChart from '@/app/_components/insights/mood-timeline-chart'
import TopicFrequencyChart from '@/app/_components/insights/topic-frequency-chart'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function getMoodTimeline() {
  try {
    const res = await fetch(`${BASE}/api/insights/mood-timeline`, { cache: 'no-store' })
    if (!res.ok) return []
    const { data } = await res.json()
    return data || []
  } catch { return [] }
}

async function getTopics() {
  try {
    const res = await fetch(`${BASE}/api/insights/topics`, { cache: 'no-store' })
    if (!res.ok) return []
    const { topics } = await res.json()
    return topics || []
  } catch { return [] }
}

export default async function InsightsPage() {
  const [moodData, topicData] = await Promise.all([getMoodTimeline(), getTopics()])
  const hasEnoughData = moodData.length >= 3

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-8 py-10 space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <Link
            href="/Journal"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={12} />
            Back to journal
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-semibold tracking-tight">Insights</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your emotional patterns and recurring themes — last 30 days.
            </p>
          </div>
        </div>

        {/* Progress gate */}
        {!hasEnoughData && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <p className="text-sm font-medium text-foreground">
              {moodData.length === 0
                ? 'Write and save your first note to start building insights.'
                : `${moodData.length} of 3 notes analysed — ${3 - moodData.length} more to unlock mood trends.`}
            </p>
            <div className="space-y-1.5">
              <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                <div
                  className="bg-primary h-1 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (moodData.length / 3) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground tabular-nums">
                {moodData.length} / 3
              </p>
            </div>
          </div>
        )}

        {/* Mood timeline */}
        <section className="space-y-3">
          <div>
            <h2 className="text-base font-semibold">Mood over time</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              ◆ orange dot = entry with Devil's Advocate reflection · dashed = 7-day average
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <MoodTimelineChart data={moodData} />
          </div>
        </section>

        {/* Top topics */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold">Top topics</h2>
          <div className="rounded-xl border border-border bg-card p-5">
            <TopicFrequencyChart topics={topicData} />
          </div>
        </section>

        {/* Inner map */}
        {topicData.length > 0 && (
          <section className="space-y-3">
            <div>
              <h2 className="text-base font-semibold">Inner map</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Frequency shown by size.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 flex flex-wrap gap-3 items-center">
              {topicData.map(({ topic, count }) => {
                const maxCount = topicData[0].count
                const size = 12 + Math.round((count / maxCount) * 16)
                return (
                  <span
                    key={topic}
                    className="text-muted-foreground hover:text-foreground cursor-default transition-colors font-medium"
                    style={{ fontSize: `${size}px` }}
                  >
                    {topic}
                  </span>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
