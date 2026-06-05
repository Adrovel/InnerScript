# InnerScript.in Landing Page Handover

Purpose: give a designer enough product, audience, visual, verbal, and technical context to design the first public landing page for `innerscript.in`.

Status: design handover, not final copy. The page should be verbal-first and explain the idea clearly before becoming visually elaborate.

## One-Line Product Description

InnerScript is a private diary and AI memory companion that turns years of journals, notes, relationships, ideas, and personal writing into source-backed self-understanding.

## What The Landing Page Must Do

The page has three jobs:

1. Make potential collaborators, cofounders, technical builders, and investors feel that this is worth working on.
2. Act as a credible project site for potential employers reviewing the engineering signal.
3. Explain the product to lay users who journal, think deeply, or want better self-understanding.

This is not a generic SaaS marketing page. It should feel like a serious idea being built by someone who understands the emotional problem and the technical depth.

## Core Intent

Most people have years of private writing scattered across journals, notes apps, documents, chats, and half-formed thoughts. That writing contains emotional patterns, repeated beliefs, unresolved questions, relationship history, ambitions, contradictions, and buried ideas.

InnerScript asks:

> What if your private writing became a source-backed mirror for understanding yourself?

The page should explain that InnerScript is trying to help a person interact with their own long-range memory, not just store notes or chat with an AI wrapper.

## The Problem

People write, think, and feel across years, but their personal context stays fragmented.

Key problem statements:

- Journals become archives that are rarely revisited.
- Notes capture thoughts but do not reveal patterns.
- Therapy-like reflection often depends on memory, but memory is incomplete.
- Personal writing contains signals about moods, relationships, avoidance, ambition, shame, ideas, and growth.
- Current note apps organize text, but they do not help the user understand themselves from that text.
- AI chat without source grounding can sound insightful while being unsupported.

The problem should feel human first, technical second.

## The Solution

InnerScript turns personal text into a private semantic memory system.

Core solution pillars:

- Write new journal entries in a calm private space.
- Import old journals, notes, reading notes, documents, voice transcripts, and eventually exported chats.
- Ask questions across years of personal writing.
- Receive reflection questions grounded in the current entry.
- Surface patterns only when there is enough source context.
- Show the source material behind insights.
- Keep the user in control of their writing, exports, and privacy.

The first product loop is simple:

```text
write -> save safely -> reflect from the current entry -> later search and understand patterns across time
```

## What InnerScript Is Not

Use this to avoid wrong positioning:

- Not a generic notes app.
- Not a shallow AI chat over notes.
- Not a therapist replacement.
- Not a diagnosis tool.
- Not a productivity dashboard first.
- Not a social journaling app.
- Not an app that makes unsupported claims about the user's psychology.

## Audience Breakdown

### 1. Collaborators, Cofounders, Technical Builders, Investors

What they should feel:

- This is an ambitious product with emotional depth.
- The problem is real and underbuilt.
- The technical path is serious: data modeling, semantic retrieval, imports, provenance, evaluation, source-backed AI, and eventually hosted systems.
- The founder has a specific user problem, not just a trend-chasing AI wrapper.
- There is room to build meaningful infrastructure and product taste.

What to show them:

- Clear thesis.
- Why personal text is valuable data.
- Why source-backed AI matters.
- The roadmap from local journal to semantic memory.
- Technical credibility without drowning lay readers in implementation detail.

### 2. Potential Employers

What they should feel:

- This is a real engineering project with thoughtful product judgment.
- It can demonstrate Google-relevant skills: systems thinking, retrieval, data modeling, privacy, evaluation, imports, and production tradeoffs.
- The project is scoped responsibly: journaling reliability first, then reflection, then semantic search and imports.

What to show them:

- Local-first architecture.
- PostgreSQL/pgvector direction.
- Ingestion pipelines.
- Source-backed AI behavior.
- Evaluation and benchmarks planned.
- Go/Redis distributed rate limiter as future hosted systems work.

Keep this section credible. Do not oversell features that are not built yet. Use "building toward", "planned", or "roadmap" for future layers.

### 3. Lay Users And Journalers

What they should feel:

- This understands why journaling matters.
- This is private and careful.
- This can help them see patterns without judging them.
- They do not need to be technical to understand the value.

What to show them:

- "Your writing remembers more than you do."
- "Ask your past writing what keeps repeating."
- "Get one grounded reflection question after writing."
- "See the source behind every deeper claim."

Avoid heavy engineering language in the first user-facing explanation.

## Verbal Direction

The landing page should be more verbal than visual.

It should read like a clear manifesto/product memo:

- thoughtful
- serious
- emotionally precise
- technically credible
- direct
- private
- source-grounded
- ambitious without sounding inflated

Avoid:

- startup hype
- generic AI buzzwords
- "10x your journaling" language
- fake mental-health claims
- therapy replacement language
- decorative copy that does not explain the product

## Possible Hero Direction

The hero should communicate the product plainly.

Preferred headline directions:

- "A private memory system for understanding yourself."
- "Turn years of personal writing into source-backed self-understanding."
- "Your journals, notes, and thoughts. Finally searchable, reflective, and alive."
- "A diary that remembers with you."

Supporting copy should explain:

- built for journals, notes, relationships, ideas, and long-range personal writing
- source-backed AI reflection, not unsupported advice
- local-first and privacy-first direction
- early project, looking for serious collaborators/builders

Primary CTA options:

- "Read the idea"
- "Follow the build"
- "Collaborate on InnerScript"
- "View the technical plan"

Secondary CTA options:

- "For builders"
- "For journalers"
- "For employers"

## Suggested Page Structure

### 1. Hero

Goal: explain the thesis in one strong sentence and one supporting paragraph.

Must include:

- product name
- private diary / AI memory companion framing
- source-backed self-understanding
- clear CTA for collaborators or readers

### 2. The Human Problem

Explain the fragmentation of journals, notes, chats, and thoughts.

Use human examples:

- repeated emotional loops
- forgotten decisions
- relationship patterns
- ideas that never became clear
- old writing that contains answers but is hard to revisit

### 3. What InnerScript Does

Explain the product as a sequence:

```text
write -> import -> search -> reflect -> understand patterns -> act with more clarity
```

Keep it future-aware but honest about what is early.

### 4. Why Source-Backed AI Matters

Explain that AI should not invent insight about a person's life.

Key message:

> If InnerScript says something about you, it should be able to point back to what you wrote.

### 5. For Builders / Collaborators

Explain why technical people should care.

Mention:

- local-first personal data
- semantic retrieval
- import pipelines
- provenance
- evaluation
- privacy boundaries
- AI behavior design
- future hosted systems and rate limiting

This section should make cofounders and technical collaborators feel there is real work to do.

### 6. For Employers

Explain the project as engineering signal.

Mention:

- serious data modeling
- Next.js local-first product
- PostgreSQL/pgvector direction
- retrieval evaluation
- source-backed AI
- Go/Redis distributed rate limiter roadmap
- careful product tradeoffs

Keep it understated and evidence-oriented.

### 7. For Journalers / Users

Explain why a user would care.

Focus on:

- private reflection
- understanding repeated patterns
- asking questions across years of writing
- getting one grounded reflection question after writing
- better self-understanding without unsupported diagnosis

### 8. Current Build Status

Be honest.

Possible wording:

```text
InnerScript is in early development. The first version focuses on a reliable local journal: write, save, list, open, edit, and export. Reflection, semantic search, imports, people memory, and deeper source-backed insights are being built in stages.
```

### 9. Call To Collaborate

The ending should invite the right people.

Example intent:

- technical collaborator
- cofounder
- designer
- investor who understands personal AI / memory systems
- employer reviewing project depth

CTA copy options:

- "Interested in building this?"
- "If this problem feels real to you, reach out."
- "I am looking for people who care about personal memory, source-backed AI, and emotionally serious software."

## Visual Feel

The page should feel like:

- high-end editorial
- private study
- philosophical product memo
- calm technical artifact
- emotionally serious journaling space

Not:

- bright SaaS landing page
- AI neon gradient page
- wellness pastel page
- generic productivity dashboard
- visual-heavy portfolio case study

Use generous whitespace, long-form readable sections, and restrained visual accents. The copy should carry the page.

## Color Palette

Use the existing Alexandria direction as the base.

### Base Dark Editorial Palette

| Role | Color | Usage |
|---|---|---|
| Background | `#121314` | main page background |
| Deep surface | `#0d0e0f` | footer, deep bands, immersive sections |
| Low surface | `#1b1c1d` | section blocks, subtle panels |
| Surface | `#1f2021` | content surfaces if needed |
| High surface | `#292a2b` | subtle emphasis blocks |
| Highest surface | `#343536` | strongest dark surface |
| Primary text | `#e3e2e3` | main body and headings |
| Muted text | `#c3c6d5` | supporting copy |
| Outline | `#434653` | ghost dividers only if needed |
| Primary blue | `#b1c5ff` | links, focus states, small CTAs |
| Primary container | `#3366cc` | primary action fill, sparingly |
| Gold accent | `#dcc661` | archival/highlight moments, not large backgrounds |

### Optional Therapeutic Teal Accent

Use this only as a quiet secondary accent, not a dominant theme.

| Role | Color | Usage |
|---|---|---|
| Teal base | `#8bcfc0` | small highlights, source-backed markers |
| Teal strong | `#4fb49f` | active indicators, tiny accent lines |
| Teal dim | `#28443e` | calm selected/active surface |
| Teal low | `#1f302d` | hover or quiet highlight surface |
| Teal text | `#d7f4ed` | text on dim teal surfaces |

Palette rule:

- Dark editorial should dominate.
- Blue is for trust/technical clarity.
- Gold is for archival memory and important ideas.
- Teal is for therapeutic reflection and source-backed grounding.
- Avoid purple AI gradients and startup neon.

## Typography Direction

Use the existing Alexandria typography direction:

- Headlines: `Noto Serif`, authoritative and reflective.
- Body: `Inter`, readable and modern.
- Labels: `Public Sans`, small metadata/caption feel.

The page should support long copy. Body text legibility matters more than oversized display type.

Suggested hierarchy:

- Hero headline: serif, large, calm, not shouty.
- Section headings: serif or strong sans depending on layout.
- Body copy: clear sans, generous line height.
- Labels/eyebrows: small caps or restrained metadata style.

## Layout Direction

The landing page should be content-led.

Preferred layout patterns:

- centered long-form editorial columns
- full-width dark bands with constrained readable text
- occasional side notes for technical context
- source/provenance callouts
- roadmap as a simple staged list, not a decorative timeline
- no heavy nested cards

Avoid:

- too many cards
- icon-grid sections that dilute the seriousness
- marketing hero with vague slogans
- fake product screenshots unless grounded in actual app UI
- generic AI illustration

## Technical Context For Designer

Current stack:

- Next.js app
- React
- JavaScript
- Tailwind CSS
- PostgreSQL direction
- pgvector direction for semantic search
- Drizzle currently in use for schema/migrations
- local-first journal core

Current built or recently worked-on product areas:

- journal editor
- entries sidebar
- New Note behavior
- autosave visibility and stale-save protection
- user review captured in `.wolf/user-review.md`
- git and product-knowledge docs

Current roadmap:

1. Local journal reliability.
2. One grounded reflection question after writing.
3. Semantic search and source-backed snippets.
4. Imports from journals, notes, OCR text, and exported tools.
5. Freeform people notes.
6. Source-backed insights and weekly digests.
7. Hosted profile and Go/Redis rate limiter later.

## Messaging Principles

Use:

- "source-backed"
- "private"
- "personal memory"
- "reflection"
- "self-understanding"
- "your writing"
- "patterns across time"
- "grounded in what you wrote"
- "local-first direction"

Avoid:

- "diagnose"
- "cure"
- "therapist replacement"
- "AI knows you better than you know yourself"
- "fully automated self-improvement"
- "productivity hack"
- "second brain" as the only explanation

## Copy Seeds

Use or adapt these:

```text
Your writing remembers more than you do.
```

```text
InnerScript is a private diary and AI memory companion for people who have years of journals, notes, relationships, ideas, and half-finished thoughts scattered across their life.
```

```text
It is not trying to replace therapy. It is trying to make your own writing easier to revisit, question, search, and understand.
```

```text
If the system says something about you, it should be able to point back to what you wrote.
```

```text
The first version is intentionally simple: write safely, save reliably, and receive one grounded reflection question from the current entry.
```

```text
The long-term version is a semantic memory system for personal writing: import, search, cite, reflect, and understand patterns across years.
```

```text
I am looking for people who care about emotionally serious software, source-backed AI, and personal data systems.
```

## Content Priority

The page should prioritize clarity in this order:

1. What InnerScript is.
2. Why the problem matters.
3. Why source-backed AI is different from generic AI chat.
4. What is built first.
5. What it can become.
6. Why builders/employers/investors should take it seriously.
7. How to reach out or follow the build.

## Designer Notes

- The page is more verbal than visual.
- Do not over-polish it into a generic startup page.
- Preserve the seriousness and personal nature of the product.
- Use visual design to make the writing feel premium, legible, and credible.
- The strongest version probably feels like a product manifesto crossed with a technical project page.
- Cofounders and technical people should leave thinking: "This has depth, and there is serious work here."
- Lay users should leave thinking: "This understands why my writing matters."
