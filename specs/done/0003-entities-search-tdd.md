---
card_id: 6a299cab5d919a533a0f35d6
card_short: 0003
board_id: 6a296c89a6a64010fc198fc1
---

## Context

`@jonathanleonel/kb-rag` is built on Clean Architecture. Before any adapter or use-case can be written, the core data model and the retrieval primitive must exist and be tested. This card delivers both: the entity types that flow through the entire system, and the dot-product search function that is the heart of RAG retrieval.

Search uses dot product between unit vectors, which is equivalent to cosine similarity when embeddings are pre-normalized — as is the case with `all-MiniLM-L6-v2`. This is a conscious architectural choice: fast, dependency-free, and sufficient for a bounded knowledge base.

## Objective

Implement entity types and dot-product top-K search using TDD. Two commits: failing spec first, then green implementation.

## Acceptance criteria

1. `src/core/entities/types.ts` exports three interfaces:
   - `Chunk` — `{ id: string; source: string; heading: string; content: string }`
   - `EmbeddedChunk extends Chunk` — adds `embedding: number[]`
   - `SearchResult` — `{ chunk: EmbeddedChunk; score: number }`
2. `src/infrastructure/search.ts` exports:
   - `topK(query: number[], chunks: EmbeddedChunk[], k: number): SearchResult[]`
   - Returns at most `k` results sorted by descending score
3. `src/infrastructure/search.test.ts` covers:
   - Dot product of two known vectors returns the correct scalar
   - `topK` returns results sorted by descending score
   - `topK` returns at most `k` results
4. `npm test` passes

## TDD commit sequence

1. `test(search): failing spec` — test file only, implementation absent
2. `feat(search): dot product top-K — tests green` — implementation added

## Constraints

- No new external dependencies
- Tests committed before implementation (enforced by commit sequence above)
- `k` is a required parameter — no default value
- `topK` must not mutate the input array

## Files affected

| File | Action |
|---|---|
| `src/core/entities/types.ts` | Create |
| `src/infrastructure/search.ts` | Create |
| `src/infrastructure/search.test.ts` | Create |
