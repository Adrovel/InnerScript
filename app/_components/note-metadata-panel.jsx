'use client'

import { useFileContext } from './files-context'

function MoodBar({ score }) {
  const filled = Math.round(score)
  const color =
    score >= 7 ? 'bg-emerald-500' :
    score >= 4 ? 'bg-amber-400' :
    'bg-rose-500'
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${i < filled ? color : 'bg-border'}`}
        />
      ))}
      <span className="ml-2 text-xs tabular-nums font-medium text-foreground">{score}<span className="text-muted-foreground font-normal">/10</span></span>
    </div>
  )
}

function Section({ label, children }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">{label}</p>
      {children}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-2 w-10 rounded bg-sidebar-accent" />
        <div className="flex gap-0.5">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="h-1.5 flex-1 rounded-full bg-sidebar-accent" />
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-2 w-12 rounded bg-sidebar-accent" />
        <div className="flex gap-1 flex-wrap">
          <div className="h-5 w-14 rounded-full bg-sidebar-accent" />
          <div className="h-5 w-10 rounded-full bg-sidebar-accent" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-2 w-16 rounded bg-sidebar-accent" />
        <div className="h-3 w-full rounded bg-sidebar-accent" />
        <div className="h-3 w-3/4 rounded bg-sidebar-accent" />
      </div>
    </div>
  )
}

export default function NoteMetadataPanel() {
  const { selectedNoteId, metadata } = useFileContext()

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-sidebar">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-sidebar-border">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">
          AI Analysis
        </p>
      </div>

      <div className="flex-1 px-4 py-4 space-y-5">
        {!selectedNoteId && (
          <p className="text-xs text-sidebar-foreground/50 leading-relaxed">
            Select a note to see AI analysis.
          </p>
        )}

        {!metadata && selectedNoteId && (
          <p className="text-xs text-sidebar-foreground/50 leading-relaxed">
            Write 50+ words and save — mood, topics and a devil's advocate challenge appear here automatically.
          </p>
        )}

        {metadata === 'loading' && <Skeleton />}

        {metadata && metadata !== 'loading' && (
          <>
            <Section label="Mood">
              <MoodBar score={metadata.mood_score} />
              <p className="text-xs text-sidebar-foreground/60 capitalize mt-1">
                {metadata.emotion_label} · {metadata.arousal}
              </p>
            </Section>

            {metadata.topics?.length > 0 && (
              <Section label="Topics">
                <div className="flex flex-wrap gap-1">
                  {metadata.topics.map(t => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-sidebar-accent text-sidebar-foreground/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {metadata.summary && (
              <Section label="Summary">
                <p className="text-xs text-sidebar-foreground/70 italic leading-relaxed">
                  {metadata.summary}
                </p>
              </Section>
            )}

            {metadata.da_reflection && (
              <div className="space-y-2 border-t border-sidebar-border pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-400">
                  Devil's Advocate
                </p>
                <p className="text-xs text-sidebar-foreground/80 leading-relaxed">
                  {metadata.da_reflection}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {metadata?.analysed_at && (
        <div className="px-4 py-3 border-t border-sidebar-border">
          <p className="text-[10px] text-sidebar-foreground/40 tabular-nums">
            Analysed {new Date(metadata.analysed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      )}
    </div>
  )
}
