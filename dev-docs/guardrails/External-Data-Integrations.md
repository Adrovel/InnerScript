# External Data Integrations

Purpose: clarify that external-tool integration means importing journal or journal-related data from other apps, not live scraping or unofficial API access. WhatsApp is one example, not the whole feature.

## Integration Definition

An InnerScript integration is:

> a safe way to bring user-owned text into InnerScript as journal-related source material, with provenance, review, and user control.

The first integrations should be file-based imports.

Do not start with live API integrations unless the platform officially supports export/import for this use case.

## Why This Matters

People do not only journal in a journal app. They leave personal context in:

- WhatsApp chats
- notes apps
- voice notes
- emails to themselves
- Google Docs
- Obsidian vaults
- Notion pages
- Telegram exports
- SMS exports
- old `.txt` files

InnerScript should help users convert this text into searchable personal memory.

## Integration Principles

- User must intentionally import data.
- User sees a preview before saving.
- Source provenance is preserved.
- Imported data can be deleted.
- Imported data can be excluded from AI.
- People are not auto-created without confirmation.
- The app must not use unofficial scraping or account takeover flows.

## MVP Integrations

### 1. Markdown Import

Use case:

- Obsidian notes.
- Exported journal files.
- Existing personal notes.

Parser behavior:

- preserve headings
- split by heading or paragraph
- create source record
- create entries/chunks

Google impact: High.

Reason:

- parser design, provenance, chunking, semantic indexing.

### 2. Plain Text Import

Use case:

- old journals
- copied notes
- exported logs

Parser behavior:

- preserve line breaks
- detect date headings when possible
- preview before confirm

Google impact: Medium-High.

### 3. External Tools Export/Import Agent

Use case:

- user exports personal data from another tool and imports the file into InnerScript.
- examples: WhatsApp `.txt`, Telegram export, Google Docs export, Notion export, email export, SMS export, copied text, or other user-owned files.

Important:

- This is not live app/API integration unless the platform officially supports the use case.
- This is not scraping.
- This is user-driven file import.
- WhatsApp is only the first likely chat-export parser, not a separate one-off product direction.

Parser behavior:

- detect source/tool type
- parse timestamps
- parse sender/contact names where present
- group messages into interaction windows
- let user map senders/contacts/authors to people
- let user exclude content before saving
- preserve source metadata

Suggested interaction grouping:

- by day
- by participant
- by time gap, e.g. new interaction after 6+ hours

Google impact: High.

Reason:

- real ingestion pipeline
- parser abstraction plus entity extraction/mapping
- privacy-sensitive parser
- source-backed people route

### 4. Voice Notes

Use case:

- user thinks aloud and converts speech into journal text.

Flow:

```text
record/import audio
  -> transcribe
  -> review transcript
  -> save entry
  -> delete audio by default
```

Google impact: High.

Reason:

- multimodal ingestion
- async processing
- privacy and retention policy

## Later Integrations

### Google Docs Export

Import `.docx`, `.txt`, or copied text. Avoid OAuth first.

Google impact: Medium.

### Notion Export

Import Markdown/HTML export.

Google impact: Medium.

### Telegram Export

Telegram supports user exports. Treat similarly to the exported-chat path under the external-tools import agent.

Google impact: Medium-High.

### Email Export

Start with `.eml` or pasted text, not Gmail OAuth.

Google impact: Medium.

### SMS Export

Only if user has exported file. No device scraping.

Google impact: Medium.

## Import Data Model

Every import should create:

```text
source
  -> entries
    -> chunks
      -> embeddings
      -> metadata
```

For people-aware imports:

```text
source
  -> entries
    -> interactions
      -> person links
```

## Required Import Tests

For each parser:

- valid file
- empty file
- malformed lines
- duplicate import
- large file
- unsupported encoding if relevant
- source metadata preservation

Exported-chat parser tests:

- 12-hour timestamp format
- 24-hour timestamp format
- multi-line messages
- media omitted lines
- sender name with colon
- malformed timestamp
- unknown participant

## Guardrail

If a new integration is proposed, run the direction check:

```text
FEATURE DIRECTION CHECK
Feature: <integration name>
Google impact: High / Medium / Low
Product fit: Strong / Weak
Data ownership: user export / official API / risky
Privacy risk: Low / Medium / High
Decision: Proceed / Defer / Reject
Docs to update: guardrails/External-Data-Integrations.md, architecture/Architecture.md, planning/Plan.md
```

Reject integrations that require:

- credential sharing
- scraping private apps
- bypassing platform terms
- importing other people's data without user review
- storing raw sensitive data without export/delete controls
