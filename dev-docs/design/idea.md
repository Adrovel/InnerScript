# InnerScript Idea

Purpose: preserve Joel's product intent before turning it into plans, UI choices, landing copy, and implementation tasks.

## Raw Thesis

InnerScript is a private diary and AI memory companion built from years of journal entries, notes, concepts, reading notes, and personal writing.

Joel journals heavily, roughly one entry per day across the last four years. He also reads and writes a lot, so his notes contain concepts, arguments, questions, drafts, and partially formed ideas. InnerScript should load this life-text and help him interact with himself: his trauma, patterns, moods, intentions, relationships, thinking traps, unresolved ideas, and subconscious themes.

The product should support healing, self-understanding, better thinking, better writing, and personal growth. It should be willing to surface bitter truths when grounded in the user's own data, while staying private, careful, and source-backed.

## Primary Users

1. Joel first.
2. Personal journalers who already write consistently.
3. Broader users interested in structured journaling, future authoring, self-reflection, and programs in the broad territory of Jordan Peterson-style self-authoring.

## Product Shape

InnerScript is not another generic notes app.

It should feel like:

- a private diary
- an AI memory companion
- a second brain
- therapy/reflection software first
- a relationship memory system
- a thinking and writing coach

The app should help the user understand their relationship with themselves and with other people.

## First Workflow

The first daily workflow is writing the journal.

The first screen should support:

- opening the app and writing quickly
- starting from today's entry
- staying in a reflective, private state of mind
- saving manual entries reliably before AI or imports become central
- creating a real new note immediately when the user asks for one
- keeping metadata and controls out of the writing path

"Dashboard of patterns" means a screen that summarizes recurring moods, topics, habits, relationships, loops, or changes over time. This can become useful later, but it should not replace writing as the first product loop.

The development UI should be simpler than the long-term product. It should remove friction before adding intelligence. During local review, Joel clarified:

- Share and More buttons should not exist until they do something real.
- Refresh is acceptable only if it clearly means reloading entries from the database.
- The left notes sidebar should feel calm and simple, not visually noisy.
- Created/edited metadata should not appear between the title and body because it interrupts writing.
- The first AI moment should be a reflection question, not a dashboard or broad analysis.

## Core Jobs

InnerScript should help the user:

- load old journals, notes, reading notes, and documents
- ask questions across years of writing
- find hidden patterns in mood, habits, assumptions, and self-talk
- understand trauma and recurring emotional loops
- question personal ideas, mindsets, and beliefs
- detect thinking loopholes, contradictions, and avoidance patterns
- map moods, intentions, actions, and outcomes over time
- track relationships with friends and family
- understand how interactions went, whether resentment exists, and whether a relationship feels healthy
- become a better writer by organizing and challenging personal ideas
- become a better person through grounded self-reflection

## AI Behavior

The AI should:

- answer from the user's notes
- summarize patterns
- ask reflective questions
- detect moods, themes, habits, and loops
- generate action plans
- challenge weak reasoning
- offer therapeutic-feeling reflection without pretending to be a clinician
- make the user smarter, more self-aware, and more emotionally honest
- give bitter truths when the evidence supports them

AI outputs should stay source-backed where possible. The product should avoid unsupported psychological claims.

The AI should support mode switching rather than one fixed voice. Initial modes should be explored as:

- gentle coach
- brutally honest analyst
- therapist-like reflector
- philosopher/debater
- writing/thinking coach

Mode switching must remain grounded in the user's data and must clearly separate reflection from clinical advice.

In development, mode switching should wait. Start with one current-entry reflection question after writing. Add broader modes only after the journal loop is reliable.

## Data Loading Order

The product should load data in this order:

1. Manual entries written directly in InnerScript.
2. Existing journal entries, including physical notes converted through OCR.
3. Notes from other apps such as Obsidian, Google Keep, and similar tools.
4. Reading notes, concept notes, and long-form docs.
5. Chats and relationship-related exports.

Manual writing comes first because it proves the core private diary loop before import complexity.

## Conversation With Thinkers

A visible MVP direction is to let the user converse with clearly labeled AI perspective modes based on thinkers, writers, religious figures, operators, and public personalities.

Examples:

- Nietzsche questioning the user's values
- Alex Hormozi questioning the user's sales mindset
- Jesus Christ discussing Christianity
- Machiavelli discussing power

These figures should be able to converse with the user and, eventually, with each other. This is a future layer, not the first MVP, because it needs careful source grounding and clear boundaries between personal memory and simulated external perspectives.

These experiences should never pretend to be the real person. They should be labeled as perspective simulations or lenses, cite the source material or principle being used where possible, and remain separate from claims about the user's own journal unless the answer is grounded in entries.

## Relationship Memory

Relationships should become a first-class part of InnerScript.

The app should eventually answer questions like:

- When did I interact with this person?
- How did it go?
- What emotional tone appears across our history?
- Is there resentment here?
- Am I happy with this relationship?
- What patterns repeat between us?

This should remain privacy-first and user-controlled. People records should start manually and only become more automated when the source model is strong enough.

## Product Guardrails

InnerScript should avoid becoming:

- a generic note app
- a shallow AI wrapper
- a productivity dashboard with no emotional depth
- an unsupported mental-health diagnosis tool
- a social app
- a place where imported personal data becomes hard to export or delete

## Google Signal

InnerScript should also remain a viable Google-signal project.

The product should show:

- serious data modeling
- semantic retrieval
- source-backed AI outputs
- privacy-first product judgment
- import and ingestion pipelines
- retrieval evaluation
- long-range personal data analysis
- production-quality engineering choices

The Google story should come from building a real personal-data system, not from bolting AI chat onto a notes UI.

## Open Questions

- Should the first UI keep the current Alexandria dark editorial style?
- How explicit should therapeutic language be in the UI?
- What boundaries should the product use around trauma, diagnosis, crisis language, and professional help?
- How should simulated thinkers be labeled so they feel useful without pretending to be the real person?
