---
card_id: 6a2ab94516e706b53a5c6722
card_short: "0005"
board_id: 6a296c89a6a64010fc198fc1
---

# 0005 — Phase 3: KB Adapter (TDD)

## Context
Phases 0–2 delivered the scaffold, core entity types, dot-product search, and the three
port interfaces. This phase introduces the first concrete adapter (`InMemoryKBRepository`)
and the static JSON knowledge base it loads. No external services or new npm dependencies
are introduced.

## Objective
Implement `InMemoryKBRepository implements KBRepository` backed by a static JSON file,
using TDD. Deliverables: the JSON KB and the adapter.

## Constraints
- `EmbeddedChunk` shape is fixed: `{ id: string, source: string, heading: string,
  content: string, embedding: number[] }`. Do not add fields to the type.
- Section identity is encoded in the `source` field. Use these values: `business_info`,
  `shipping`, `returns`, `warranty`, `product_faq`.
- Embeddings in the JSON must be hand-crafted unit vectors (e.g. `[1,0,0,...]`) so
  tests are deterministic. Do not run `@xenova/transformers` here.
- `@xenova/transformers` and `@anthropic-ai/sdk` are NOT added in this phase.
- `KBRepository` port is already defined — implement it, do not redefine it.
- Tests must be committed before implementation (TDD).
- All three quality gates must pass: `npm run lint`, `npm run typecheck`, `npm test`.

## Acceptance criteria

### 1. Static KB — `src/infrastructure/kb/data.json`
- At least one `EmbeddedChunk` per section: `business_info`, `shipping`, `returns`,
  `warranty`, `product_faq` (minimum 5 chunks total).
- Each chunk conforms exactly to `EmbeddedChunk`: `id`, `source`, `heading`,
  `content`, `embedding`.
- All embedding vectors have the same length (minimum 3 dimensions).
- Content is fictional sporting goods store data — no real business data.

### 2. Adapter — `src/adapters/inmemory-kb-repository.ts`
- Exports `InMemoryKBRepository` that implements `KBRepository`.
- Constructor loads `data.json` (static import or `fs` read — executor's choice).
- `getAll(): Promise<EmbeddedChunk[]>` returns all chunks from the JSON.

### 3. Tests — `src/adapters/inmemory-kb-repository.test.ts`
Written before implementation. Must cover:
1. `getAll()` returns the correct number of chunks (matches `data.json` length).
2. Every returned chunk has `id`, `source`, `heading`, `content`, and `embedding`
   fields present and of the correct types.
3. Search integration: calling `topK` over `getAll()` results with a query vector
   that matches one chunk's embedding returns that chunk as the top result.

### 4. Quality gates
- `npm run lint` exits 0.
- `npm run typecheck` exits 0.
- `npm test` exits 0 (all existing tests still pass).

## TDD commit sequence
1. `test(kb-repository): failing spec`
2. `feat(kb-repository): InMemoryKBRepository — tests green`

## Files affected
- `src/infrastructure/kb/data.json` — new
- `src/adapters/inmemory-kb-repository.ts` — new
- `src/adapters/inmemory-kb-repository.test.ts` — new

No existing files modified.
