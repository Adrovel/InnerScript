---
name: Alexandria
colors:
  surface: '#121314'
  surface-dim: '#121314'
  surface-bright: '#38393a'
  surface-container-lowest: '#0d0e0f'
  surface-container-low: '#1b1c1d'
  surface-container: '#1f2021'
  surface-container-high: '#292a2b'
  surface-container-highest: '#343536'
  on-surface: '#e3e2e3'
  on-surface-variant: '#c3c6d5'
  inverse-surface: '#e3e2e3'
  inverse-on-surface: '#303031'
  outline: '#8d909e'
  outline-variant: '#434653'
  surface-tint: '#b1c5ff'
  primary: '#b1c5ff'
  on-primary: '#002c70'
  primary-container: '#3366cc'
  on-primary-container: '#e7ebff'
  inverse-primary: '#2259bf'
  secondary: '#c2c7cc'
  on-secondary: '#2c3135'
  secondary-container: '#42474b'
  on-secondary-container: '#b1b6ba'
  tertiary: '#dcc661'
  on-tertiary: '#393000'
  tertiary-container: '#bfab49'
  on-tertiary-container: '#4a3f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b1c5ff'
  on-primary-fixed: '#001946'
  on-primary-fixed-variant: '#00419d'
  secondary-fixed: '#dfe3e8'
  secondary-fixed-dim: '#c2c7cc'
  on-secondary-fixed: '#171c20'
  on-secondary-fixed-variant: '#42474b'
  tertiary-fixed: '#f9e37a'
  tertiary-fixed-dim: '#dcc661'
  on-tertiary-fixed: '#211b00'
  on-tertiary-fixed-variant: '#524600'
  background: '#121314'
  on-background: '#e3e2e3'
  surface-variant: '#343536'
typography:
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
---

# Alexandria — High-End Editorial

## North Star: "The Digital Curator"
A scholarly, premium reading experience. Dense information made effortless through serif authority and generous whitespace. Now optimized for deep focus in a sophisticated dark-mode environment.

## Colors
- **Primary (`#3366cc`):** Links, primary actions, focus states only.
- **Surface tiers** create hierarchy—no explicit borders. Use background shifts between `surface-container-lowest` → `surface-dim`.
- **Tertiary (`#fee77e`):** Archival gold for highlights and badges.
- **No-Line Rule:** Never use 1px borders. Define boundaries through background color shifts.
- Use glassmorphism for floating menus (80% opacity + 20px backdrop-blur). Gradient CTAs from `primary` → `primary_container`.

## Secondary Palette Candidate — Not Applied Yet

Purpose: improve note/sidebar highlighting without changing the current UI immediately.

Color direction: muted therapeutic green-teal, distinct from the blue primary and gold tertiary.

| Component | Token / Color | Usage note |
|---|---|---|
| Secondary base | `#8bcfc0` | Main secondary accent for selected note/focus details. |
| Secondary strong | `#4fb49f` | Small active indicators, not large backgrounds. |
| Secondary dim | `#28443e` | Selected note row background in dark mode. |
| Secondary low | `#1f302d` | Hover background for note rows. |
| On secondary | `#06211c` | Text on bright secondary chips/buttons if needed. |
| On secondary container | `#d7f4ed` | Text on dim secondary surfaces. |
| Sidebar selected note row | bg `#28443e`, text `#d7f4ed`, icon `#8bcfc0` | Should make the selected note clearer than current surface-only highlight. |
| Sidebar note hover | bg `#1f302d`, text `#e3e2e3`, icon `#8bcfc0` at 70% | Quiet hover affordance, still Obsidian-like. |
| Sidebar folder row | text `#c3c6d5`, folder icon `#8bcfc0` at 65% | Keep folders subdued; notes should remain the focus. |
| New Note button secondary version | bg `#28443e`, text `#d7f4ed`, icon `#8bcfc0` | Optional calmer alternative to the current primary button. |
| Focus ring | `#8bcfc0` at 45% | Use for note/sidebar focus only if primary focus feels too loud. |
| Count/meta chip | bg `#1f302d`, text `#9fdccd` | Optional for word/character count if footer needs more personality. |

Do not apply this palette until Joel explicitly asks for the secondary pass.

## Typography
- **Headlines:** Noto Serif — large, authoritative, generous leading.
- **Body:** Inter — modern clarity for dense text.
- **Labels:** Public Sans — archival metadata feel.

## Elevation
- Depth through tonal layering, not shadows. Stack surface tokens for natural elevation in the dark interface.
- Modals: extra-diffused shadows (24-40px blur, 4-6% opacity, tinted `on_surface`).
- If borders needed: "Ghost Border" — `outline_variant` at 15% opacity.

## Components
- **Buttons:** Primary = gradient fill, Secondary = surface-high bg + primary text, Tertiary = text + hover underline.
- **Cards:** No divider lines. Use spacing or alternating surface colors.
- **Inputs:** Dark surface bg, ghost border, focus = primary border.

## Rules
- Use whitespace as structure. Serif for narrative text. One primary action per view.
- **Roundedness:** Minimum 0.5rem (8px) corners for standard elements; 1rem (16px) for larger containers. Never use sharp corners.
