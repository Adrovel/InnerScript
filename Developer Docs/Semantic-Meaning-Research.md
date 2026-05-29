# Semantic Meaning and Search Research

Date: 2026-05-29
Purpose: research base for InnerScript's semantic journal search, people understanding, imported-text analysis, and Google-interview explanation.

## Why This Matters For InnerScript

InnerScript depends on one core technical claim:

> Unstructured personal text can be converted into useful semantic representations, then searched, clustered, summarized, and connected back to the user's lived context.

This doc collects the papers, lectures, and engineering references needed to understand that claim from first principles.

## Learning Path

Read in this order:

1. Vector space retrieval.
2. Distributional semantics.
3. Word embeddings.
4. Contextual embeddings.
5. Sentence/document embeddings.
6. Dense retrieval.
7. Vector indexes and approximate nearest neighbor search.
8. RAG and provenance.
9. Evaluation for personal text.

## Core Ideas

### 1. Meaning From Context

The key idea behind modern text embeddings is distributional semantics:

> Words and passages that occur in similar contexts tend to have related meanings.

For InnerScript:

- A note about "I feel behind on Google prep" may semantically match "I am scared I am wasting time" even if exact words differ.
- A person page can group interactions by meaning, not only by names.
- Imported WhatsApp text can be searched for themes like "supportive advice" or "money anxiety" without exact keywords.

This is not human-level understanding. It is a useful statistical representation of usage patterns.

## Foundational Papers

### Vector Space Model and Latent Semantic Analysis

#### Latent Semantic Analysis / Latent Semantic Indexing

Source:
- Landauer and Dumais, "A Solution to Plato's Problem: The Latent Semantic Analysis Theory of Acquisition, Induction, and Representation of Knowledge"  
  https://www.stat.cmu.edu/~cshalizi/350/2008/readings/Landauer-Dumais.pdf

Why it matters:

- Early proof that matrix-based representations can capture hidden semantic structure.
- Shows that exact keyword matching is not enough.
- Useful background for explaining why "semantic search" existed before transformers.

InnerScript use:

- Good historical grounding for "meaning as geometry."
- Helps explain why dimensionality reduction and co-occurrence matter.

#### Vector Space Retrieval

Source:
- Stanford CS276, Information Retrieval and Web Search  
  https://web.stanford.edu/class/cs276/
- Stanford CS276 vector-space lecture handout  
  https://web.stanford.edu/class/cs276/handouts/lecture7-vectorspace-1per.pdf

Why it matters:

- Introduces documents and queries as vectors.
- Explains term weighting, ranking, cosine similarity, and retrieval evaluation.
- This is the bridge from search engines to semantic search.

InnerScript use:

- Baseline search: BM25 / keyword / vector-space ranking.
- Compare lexical search vs embedding search in interviews.

## Word Embeddings

### Word2Vec

Source:
- Mikolov et al., "Efficient Estimation of Word Representations in Vector Space"  
  https://arxiv.org/abs/1301.3781

Core idea:

- Learn word vectors from large corpora using predictive tasks.
- Words used in similar contexts end up near each other in vector space.

Why it matters:

- Clear foundation for the embedding mental model.
- Explains why vector distance can approximate semantic relatedness.

InnerScript use:

- Not the model to use directly, but essential for explaining where embeddings came from.

### GloVe

Source:
- Pennington, Socher, Manning, "GloVe: Global Vectors for Word Representation"  
  https://aclanthology.org/D14-1162/
- Stanford GloVe project page  
  https://www-nlp.stanford.edu/projects/glove/

Core idea:

- Learn word vectors from global word-word co-occurrence statistics.
- Captures useful linear substructure in vector spaces.

Why it matters:

- Shows a second path to embeddings: global corpus statistics rather than only local prediction.
- Useful for explaining co-occurrence and semantic structure.

InnerScript use:

- Background only. Do not use GloVe for production journal search.

## Transformers and Contextual Meaning

### Attention Is All You Need

Source:
- Vaswani et al., "Attention Is All You Need"  
  https://arxiv.org/abs/1706.03762
- Google Research page  
  https://research.google/pubs/attention-is-all-you-need/

Core idea:

- Transformer architecture replaces recurrence/convolution with attention mechanisms.
- Attention lets models condition token representations on context.

Why it matters:

- Modern embedding models and LLMs are transformer-based.
- Context matters: "bank" in "river bank" differs from "bank account."

InnerScript use:

- Explains why modern embeddings work better for journal passages than static word vectors.

### BERT

Source:
- Devlin et al., "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding"  
  https://arxiv.org/abs/1810.04805
- Google Research page  
  https://research.google/pubs/bert-pre-training-of-deep-bidirectional-transformers-for-language-understanding/

Core idea:

- Bidirectional transformer pretraining learns contextual language representations.
- Strong for semantic understanding tasks after fine-tuning.

Why it matters:

- Establishes contextual embeddings as a general NLP foundation.
- Helps explain sentence similarity, classification, and retrieval models.

InnerScript use:

- Background for metadata extraction, semantic labeling, and contextual retrieval.

## Sentence and Passage Embeddings

### Sentence-BERT

Source:
- Reimers and Gurevych, "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks"  
  https://arxiv.org/abs/1908.10084

Core idea:

- Standard BERT is expensive for pairwise sentence comparison.
- SBERT creates sentence embeddings that can be compared efficiently with cosine similarity.

Why it matters:

- This is one of the most directly relevant papers for InnerScript.
- It shows how to produce semantically meaningful sentence vectors for search, clustering, and similarity.

InnerScript use:

- Justifies chunk embeddings.
- Explains why entries should be split into passages/paragraphs before indexing.

### Dense Passage Retrieval

Source:
- Karpukhin et al., "Dense Passage Retrieval for Open-Domain Question Answering"  
  https://arxiv.org/abs/2004.04906

Core idea:

- Encode questions and passages into dense vectors.
- Retrieve passages by vector similarity instead of relying only on BM25/TF-IDF.

Why it matters:

- Directly relevant to RAG and semantic search.
- Shows the query encoder / passage encoder model of retrieval.

InnerScript use:

- Search journal chunks with natural-language questions.
- Compare dense retrieval to keyword search.

### ColBERT

Source:
- Khattab and Zaharia, "ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT"  
  https://arxiv.org/abs/2004.12832

Core idea:

- Encodes queries and documents separately, then uses late interaction for better ranking.
- Stronger than simple single-vector representations in some retrieval settings.

Why it matters:

- Shows that "one embedding per document" is not the final form of retrieval.
- Useful for future ranking improvements when InnerScript's search needs higher precision.

InnerScript use:

- Future reranking or advanced retrieval.
- Interview discussion: simple dense retrieval vs late-interaction retrieval.

### Contriever / Unsupervised Dense Retrieval

Source:
- Izacard et al., "Unsupervised Dense Information Retrieval with Contrastive Learning" / Contriever  
  https://arxiv.org/abs/2112.09118
- Related ACL page: "Learning to Retrieve Passages without Supervision"  
  https://aclanthology.org/2022.naacl-main.193/

Core idea:

- Dense retrievers can be trained without manually labeled query-passage pairs.

Why it matters:

- Personal journal data has no labeled retrieval dataset.
- Useful for thinking about self-supervised retrieval and domain adaptation.

InnerScript use:

- Future local/personalized retrieval experiments.
- Not required for MVP.

## RAG and External Memory

### Retrieval-Augmented Generation

Source:
- Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"  
  https://arxiv.org/abs/2005.11401

Core idea:

- Combine a parametric model with non-parametric memory retrieved from an index.
- The model generates answers conditioned on retrieved passages.

Why it matters:

- This is the conceptual basis for "chat with journal memory."
- Also gives provenance: answers can point back to retrieved entries.

InnerScript use:

- Chat over selected notes.
- Weekly digests grounded in source entries.
- People summaries with source-backed interactions.

Design rule:

- Every generated personal insight should link back to raw entries/chunks.

## Vector Indexing and Approximate Nearest Neighbor Search

### HNSW

Source:
- Malkov and Yashunin, "Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs"  
  https://arxiv.org/abs/1603.09320

Core idea:

- Build a layered graph over vectors to search nearby points quickly.
- Trades exactness for speed and scalability.

Why it matters:

- Semantic search becomes expensive as data grows.
- HNSW is one of the standard ANN methods used in vector databases.

InnerScript use:

- For local MVP, pgvector exact search or small ANN indexes are enough.
- For hosted scale, explain HNSW/IVFFlat trade-offs.

### pgvector

Source:
- pgvector GitHub/docs  
  https://github.com/pgvector/pgvector

Core idea:

- Store vectors directly in PostgreSQL.
- Supports exact and approximate nearest neighbor search.
- Index options include HNSW and IVFFlat.

Why it matters:

- InnerScript can keep relational data and vectors in one database.
- Easier local open-source setup than introducing a separate vector database early.

InnerScript use:

- Store chunk embeddings.
- Run semantic search with filters over person, date, source, emotion, and topic.

## Lectures and Courses

### Stanford CS224N — Natural Language Processing with Deep Learning

Source:
- Course archive  
  https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1214/index.html
- 2026 word vectors lecture PDF  
  https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture02-wordvecs.pdf

Use for:

- Word vectors.
- Distributional semantics.
- Neural NLP basics.
- Transformers and contextual representations.

Recommended InnerScript focus:

- Word vector lectures.
- Attention/transformer lectures.
- Question answering / retrieval lectures if available in the offering.

### Stanford CS276 — Information Retrieval and Web Search

Source:
- Course page  
  https://web.stanford.edu/class/cs276/

Use for:

- Query/document vector models.
- Ranking.
- Indexing.
- Evaluation metrics.
- Web-scale retrieval concepts.

Recommended InnerScript focus:

- Vector space model.
- Scoring and ranking.
- Evaluation: precision, recall, MAP/NDCG.

### UIUC CS440 Vector Semantics

Source:
- Vector semantics lecture  
  https://courses.grainger.illinois.edu/cs440/fa2022/lectures/vector-semantics.html

Use for:

- A concise explanation of word embeddings and vector semantics.
- Good refresher before reading papers.

## Product Research Questions

These are the practical questions InnerScript should answer through implementation and tests.

### Chunking

Question:

- Should journal entries be embedded as full documents, paragraphs, sentence windows, or mixed levels?

Hypothesis:

- Paragraph/chunk embeddings will retrieve more precise memories than full-entry embeddings.

Experiment:

- Create 30 sample journal entries.
- Compare retrieval quality for full-entry vs paragraph chunks.
- Score manually: relevant, partially relevant, irrelevant.

### Hybrid Search

Question:

- Should InnerScript use dense-only search or combine keyword + dense retrieval?

Hypothesis:

- Hybrid search works better for names, exact events, and technical terms.

Experiment:

- Compare keyword, dense, and hybrid search across queries:
  - "Google prep"
  - "felt behind"
  - "Prithvi"
  - "money anxiety"
  - "same problem again"

### People Retrieval

Question:

- Should people pages be created manually or auto-detected from text?

Hypothesis:

- Manual creation plus suggested links is better than aggressive auto-creation.

Reason:

- Personal text is messy and privacy-sensitive.
- False person entities will reduce trust.

### Semantic Drift

Question:

- Can the app detect when the user's meaning around a topic changes over time?

Example:

- "Google prep" may shift from excitement to anxiety to routine execution.

Possible approach:

- Store topic-specific chunks over time.
- Cluster or compare embeddings over monthly windows.
- Use LLM only for final explanation, not raw detection.

## Evaluation Metrics For InnerScript

Search quality:

- Precision@5: how many top 5 results are actually useful?
- Recall@k for manually labeled memories.
- MRR: does the best relevant memory appear near the top?

Insight quality:

- Source-backed: every insight links to entries.
- User-rated usefulness: useful / maybe / wrong.
- Stability: repeated runs should not wildly change facts.
- Privacy: user understands what text was sent to AI.

Performance:

- p95 search latency.
- import throughput.
- embedding queue latency.
- token/API cost per entry.

## Recommended Implementation Direction

### MVP

- PostgreSQL + pgvector.
- Embed chunks, not only full entries.
- Use OpenAI embeddings initially.
- Store provenance for every chunk.
- Use hybrid search if keyword filters are easy.
- Keep all AI outputs source-linked.

### Later

- Add reranking for top 20 retrieved chunks.
- Compare OpenAI embeddings vs local embedding model.
- Add HNSW index when data size makes exact search slow.
- Add offline evaluation dataset from synthetic/sample journal entries.

## Interview Talking Points

Strong Google-facing points:

- Difference between lexical retrieval and dense semantic retrieval.
- Why chunking matters.
- Why provenance is necessary for personal insights.
- Why embeddings are useful but not "understanding" in the human sense.
- Why pgvector is a pragmatic MVP choice.
- HNSW/IVFFlat trade-offs for scale.
- Hybrid search for exact entities plus semantic queries.
- Evaluation matters more than demos.

Avoid overclaiming:

- Do not say the app "understands the user's mind."
- Say it builds "source-backed semantic representations of personal text."
- Do not imply embeddings are perfectly interpretable.
- Do not claim therapeutic outcomes.

## Short Reading List

Read first:

1. Stanford CS224N word vectors lecture.
2. Stanford CS276 vector-space retrieval lecture.
3. Word2Vec paper.
4. GloVe paper.
5. Attention Is All You Need.
6. BERT.
7. Sentence-BERT.
8. Dense Passage Retrieval.
9. RAG paper.
10. HNSW paper.

Then implement:

- chunking
- embedding
- semantic search
- source-backed retrieval UI
- manual evaluation set

