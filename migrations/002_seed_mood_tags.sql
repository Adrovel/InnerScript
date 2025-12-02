-- Seed: Insert 7 predefined mood tags
-- Created: 2025-12-02
-- Description: Populates tags table with mood presets

BEGIN;

-- Insert tags with colors (using Tailwind-friendly values)
INSERT INTO public.tags (name, slug, color, icon, display_order)
VALUES
  ('Happy', 'happy', '#FCD34D', 'Smile', 1),
  ('Sad', 'sad', '#93C5FD', 'Frown', 2),
  ('Anxious', 'anxious', '#FCA5A5', 'AlertCircle', 3),
  ('Calm', 'calm', '#A7F3D0', 'Wind', 4),
  ('Excited', 'excited', '#FDE68A', 'Zap', 5),
  ('Angry', 'angry', '#F87171', 'Flame', 6),
  ('Grateful', 'grateful', '#D8B4FE', 'Heart', 7)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
