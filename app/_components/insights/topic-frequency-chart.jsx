'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-background border border-border rounded-lg p-2 text-xs shadow-md">
      <p>{payload[0].payload.topic}: <span className="font-semibold">{payload[0].value}</span> entries</p>
    </div>
  )
}

export default function TopicFrequencyChart({ topics }) {
  if (!topics || topics.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        No topics yet. Topics appear after 3+ analysed notes.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={topics} layout="vertical" margin={{ left: 20, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis type="number" tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="topic" tick={{ fontSize: 11 }} width={80} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} name="Entries" />
      </BarChart>
    </ResponsiveContainer>
  )
}
