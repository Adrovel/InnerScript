'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useRouter } from 'next/navigation'

function DotWithDA(props) {
  const { cx, cy, payload } = props
  if (payload.has_da) {
    return (
      <polygon
        key={`da-${payload.note_id}`}
        points={`${cx},${cy - 7} ${cx + 5},${cy + 3} ${cx - 5},${cy + 3}`}
        fill="#f97316"
        stroke="none"
      />
    )
  }
  return <circle key={`dot-${payload.note_id}`} cx={cx} cy={cy} r={3} fill="#6366f1" stroke="none" />
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-background border border-border rounded-lg p-3 text-xs shadow-md space-y-1">
      <p className="font-semibold">{d.date}</p>
      <p>Mood: <span className="font-medium">{d.mood_score}/10</span></p>
      <p>7-day avg: {d.rolling_avg}</p>
      <p className="capitalize text-muted-foreground">{d.emotion_label}</p>
      {d.has_da && <p className="text-orange-500 font-medium">◆ Devil's Advocate reflection</p>}
    </div>
  )
}

export default function MoodTimelineChart({ data }) {
  const router = useRouter()

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        No mood data yet. Write and save 3+ notes to see your timeline.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={data}
        onClick={(p) => {
          const id = p?.activePayload?.[0]?.payload?.note_id
          if (id) router.push(`/Journal`)
        }}
        style={{ cursor: 'pointer' }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis domain={[1, 10]} ticks={[1, 3, 5, 7, 10]} tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="mood_score"
          stroke="#6366f1"
          strokeWidth={2}
          dot={<DotWithDA />}
          name="Mood Score"
        />
        <Line
          type="monotone"
          dataKey="rolling_avg"
          stroke="#a5b4fc"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          name="7-day avg"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
