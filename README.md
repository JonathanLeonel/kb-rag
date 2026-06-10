# kb-rag

A lightweight, framework-agnostic RAG (Retrieval-Augmented Generation) package for Node.js.  
Runs fully local — no external embedding API required.

```bash
npm install @jonathanleonel/kb-rag
```

---

## Why this exists

### The problem

A B2B SaaS platform for e-commerce sellers needs to automate responses to buyer questions on MercadoLibre.

Each seller has a **response manual** containing:
- Basic seller info and tone guidelines
- Shipping policies
- Return and exchange policies
- Product catalog information

**Phase 1 — naive approach:** wrap the Claude API, pass the entire manual + the buyer's question as a prompt, return the answer.

This works but has two problems at scale:
1. Every request sends the full manual — token cost grows linearly with manual size
2. Most of the manual is irrelevant to any given question — shipping policy doesn't help answer a question about product dimensions

**Phase 2 — hybrid approach:** the manual is split into two layers with different handling.

**Layer 1 — fixed system prompt:** sections that go in every request regardless of the question.

```
info_negocio, principios_no_negociables, palabras_prohibidas, escalado_humano
```

These define identity, tone, hard rules, and escalation triggers. They're stable per seller, so they're placed first in the prompt and are good candidates for Anthropic's prompt cache (5-minute TTL). Cache hit rate depends on question volume per seller within that window.

**Layer 2 — RAG retrieval:** sections that are retrieved dynamically based on semantic similarity to the question.

```
envios, cambios_devoluciones, garantia, faq_producto, seccion_libre
```

Before building the final prompt, the system:
1. Splits these sections into **chunks**
2. Converts each chunk into a **vector embedding** — a 384-dimensional representation of its semantic meaning
3. At query time, embeds the buyer's question using the same model
4. Computes the **dot product** between the query vector and all chunk vectors
5. Selects the top-K most semantically similar chunks

The final prompt structure:

```
[Layer 1: fixed sections]   ← always present, prompt cache candidate
[Layer 2: top-K chunks]     ← dynamic, selected by dot product
[buyer's question]
```

Result: ~80% reduction in tokens per request compared to sending the full manual. Manual sections are persisted and versioned in the database; embeddings are a derived artifact regenerated whenever a section changes.

---

## How dot product retrieval works

Both chunks and queries are embedded using the same model (`all-MiniLM-L6-v2`), producing unit vectors in the same 384-dimensional semantic space.

The dot product between two unit vectors gives a scalar in [-1, 1]:

```
dot(query, chunk) = Σ query[i] × chunk[i]   for i in 0..383
```

- `1.0` → identical semantic direction
- `0.0` → unrelated
- negative → rare in text embeddings; models represent "absence of concept" near zero, not in the opposite direction

Since both vectors are unit vectors (L2 norm = 1), dot product is equivalent to cosine similarity — simpler to compute, same result.

---

## Why `all-MiniLM-L6-v2`

Evaluated against the [MTEB leaderboard](https://huggingface.co/spaces/mteb/leaderboard) filtering by Semantic Textual Similarity tasks and model size.

| Model | Dims | Params | License | Notes |
|-------|------|--------|---------|-------|
| `all-MiniLM-L6-v2` | 384 | 22M | Apache 2.0 | ✓ chosen |
| `all-mpnet-base-v2` | 768 | 109M | Apache 2.0 | better quality, 5× larger |
| `text-embedding-ada-002` | 1536 | — | proprietary | requires API key |

`all-MiniLM-L6-v2` was fine-tuned specifically for sentence similarity tasks (MS MARCO + NLI datasets) — not a base model adapted post-hoc. For a bounded corpus like a seller manual (tens to hundreds of chunks), 384 dimensions provide sufficient semantic granularity. The quality/size tradeoff is conscious and documented.

Running via `@xenova/transformers` means the model runs **in-process** — no network calls, no API keys, no per-request cost. The model downloads once to disk on first run.

---

## Architecture

Clean Architecture with Ports & Adapters (Hexagonal):

```
src/
├── core/
│   ├── entities/types.ts          ← Chunk, EmbeddedChunk, SearchResult
│   ├── use-cases/ask-rag.ts       ← askRag (DI: Embedder, KBRepository, Generator)
│   ├── use-cases/build-system-prompt.ts
│   └── ports/
│       ├── embedder.port.ts       ← interface Embedder
│       ├── generator.port.ts      ← interface Generator
│       └── kb-repository.port.ts  ← interface KBRepository
├── adapters/
│   ├── xenova-embedder.ts         ← implements Embedder
│   ├── anthropic-generator.ts     ← implements Generator
│   └── inmemory-kb-repository.ts  ← implements KBRepository
├── infrastructure/
│   ├── search.ts                  ← dot product top-K
│   └── cli.ts
└── index.ts                       ← public exports
```

**Rules:**
- `core/` has zero external dependencies
- Each adapter implements exactly one port, no business logic
- Use cases receive dependencies injected — they never instantiate adapters directly
- Interface names are abstract and pure: `Embedder`, not `IEmbedder`. Implementations carry the "how": `XenovaEmbedder implements Embedder`

**Swapping adapters:** DataClara uses this package with a `DrizzleKBRepository implements KBRepository` — same use case, different storage backend. The core is untouched.

---

## Stack

- TypeScript 5 strict
- Vitest (TDD on entities and use-cases)
- `@xenova/transformers` — local embeddings
- `@anthropic-ai/sdk` — generation
- `tsx` — runtime

---

## Production context

Extracted from [DataClara](https://github.com/JonathanLeonel/data-clara) — a multi-tenant SaaS platform for MercadoLibre sellers built with Next.js 14, TypeScript, and PostgreSQL.
