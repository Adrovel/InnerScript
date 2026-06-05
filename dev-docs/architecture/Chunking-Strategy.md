# Chunking Strategy

Purpose: define InnerScript's first chunking strategy in a way Joel can implement, test, and explain in a Google-style project discussion.

Status: initial Phase 3 strategy. This should be revisited after retrieval evaluation exists.

## Decision

Use paragraph-first chunking with a max-token fallback.

Initial rule:

1. Split entry body by blank-line paragraph boundaries.
2. Keep normal paragraphs as individual chunks when they are large enough to stand alone.
3. Merge tiny adjacent paragraphs until the chunk reaches the minimum useful size or the next merge would exceed the target size.
4. Split oversized paragraphs by sentence where possible.
5. Fall back to word-window splitting when sentence splitting cannot keep the chunk under the max size.

Initial sizing:

- minimum useful chunk size: 40 words
- target chunk size: 120 to 220 words
- maximum chunk size: 320 words
- overlap: none for paragraph chunks; 30 words only for oversized fallback splits

These are word-count approximations for the first implementation. Token-counting can replace word-counting later if retrieval quality suffers.

## Why This Strategy

Journal entries are usually written in paragraphs that already express one thought, feeling, event, or decision. Paragraph-first chunking preserves the user's natural writing structure better than fixed-size windows.

Fixed-size chunking is easier to implement, but it can cut through emotionally important sentences and make citations feel untrustworthy.

Heading-aware chunking is useful for imported Markdown or structured notes, but manual journal entries may not have headings.

Semantic chunking may eventually produce better retrieval units, but it adds model dependency, cost, latency, and evaluation complexity before the baseline retrieval system exists.

Paragraph-first with max-token fallback is the best first strategy because it is deterministic, testable, cheap, explainable, and good enough to create an evaluation baseline.

## Alternatives Considered

| Strategy | Strength | Weakness | Decision |
|---|---|---|---|
| Fixed-size windows | Simple and predictable | Can split thoughts mid-sentence; weak citations | Do not start here |
| Paragraph-first | Preserves writing structure; explainable | Needs fallback for very long paragraphs | Start here |
| Heading-aware | Good for Markdown/imports | Weak for freeform journal entries | Add later for imports |
| Semantic chunking | Potentially better boundaries | Higher complexity/cost; harder to debug | Defer until baseline search exists |

## Chunk Metadata

Each chunk should store:

```text
id
entry_id
chunk_index
text
word_count
char_count
start_char
end_char
boundary_type
overlap_previous
metadata jsonb
created_at
updated_at
```

`boundary_type` values for the first implementation:

- `paragraph`
- `merged_paragraphs`
- `sentence_split`
- `word_window_fallback`

Metadata should include enough information to explain how the chunk was made without rereading the original entry.

## Source References

Every chunk must be traceable back to:

- entry id
- chunk index
- original character range
- entry title if present
- occurred date if present

The UI should eventually show source snippets as "from this entry" rather than academic citations.

## Failure Modes

| Failure mode | Risk | First mitigation |
|---|---|---|
| Tiny chunks | Retrieval returns vague fragments | Merge adjacent tiny paragraphs |
| Huge paragraphs | Embeddings blur multiple topics | Split by sentence, then fallback word windows |
| Lost context at split boundary | Important sentence depends on prior sentence | Use small overlap only for oversized fallback splits |
| Bad citations | User cannot trust AI output | Store character ranges and chunk indexes |
| Stale chunks | Search uses old text after edit | Rebuild chunks whenever entry body changes |
| Empty entries | Useless chunks | Create no chunks |
| Over-engineering | Delays retrieval work | Keep first version deterministic and word-count based |

## Implementation Rules

- Implement chunking as a pure utility first.
- Add unit tests before wiring database persistence.
- Do not call an AI model during chunking.
- Do not embed until chunk output is deterministic and tested.
- Rebuild chunks when entry body changes.
- Deleting an entry must delete or orphan-protect its chunks according to the schema rule chosen during implementation.

## Interview Explanation

Joel should be able to say:

> I started with paragraph-first chunking because journal entries already contain human-authored thought boundaries. Fixed windows were simpler but produced weaker citations. Semantic chunking was deferred because I needed a deterministic baseline before measuring retrieval quality. The fallback handles long paragraphs without introducing model cost. Each chunk stores source ranges so later AI answers can point back to the exact entry text.

## Open Evaluation Questions

- Does paragraph-first retrieval outperform full-entry embeddings for personal journal queries?
- Do merged tiny paragraphs make search results more coherent?
- Is 320 words too large for emotionally dense entries?
- Does overlap help or create duplicate retrieval noise?
- How should chunking change for imported Markdown, chats, or voice transcripts?
