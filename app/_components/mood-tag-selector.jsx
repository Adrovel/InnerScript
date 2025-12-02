'use client'

import { cn } from '@/lib/utils'

/**
 * MoodTagSelector Component
 *
 * A multi-select tag selector for mood tags.
 * Displays tags as clickable pills/badges with visual feedback.
 *
 * @param {Array} availableTags - Array of tag objects from API
 * @param {Array} selectedTagIds - Array of currently selected tag IDs
 * @param {Function} onTagToggle - Callback when tag is toggled (tagId)
 * @param {Boolean} disabled - Disable all interactions
 */
export function MoodTagSelector({
  availableTags = [],
  selectedTagIds = [],
  onTagToggle,
  disabled = false
}) {

  const handleTagClick = (tagId) => {
    if (disabled) return
    onTagToggle?.(tagId)
  }

  if (!availableTags || availableTags.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-2 my-4">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        Mood
      </label>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id)

          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagClick(tag.id)}
              disabled={disabled}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                "border-2 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isSelected
                  ? "border-transparent shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              )}
              style={{
                backgroundColor: isSelected ? tag.color : undefined,
                color: isSelected ? '#000' : '#6B7280',
                borderColor: isSelected ? tag.color : undefined,
                '--tw-ring-color': tag.color,
              }}
              aria-pressed={isSelected}
            >
              {tag.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
