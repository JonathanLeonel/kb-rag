---
card_id: 6a2af49b30791f35e97d469c
card_short: "0006"
board_id: 6a296c89a6a64010fc198fc1
---

# 0006 — Use Cases: askRag + buildSystemPrompt

## Context
Phases 0–3 delivered the scaffold, entity types, dot-product search, port interfaces,
and the `InMemoryKBRepository` adapter. This phase implements the two core use cases
that orchestrate the full RAG pipeline. Ported from DataClara's `core/rag/prompts.ts`
and `core/rag/index.ts`, decoupled from Drizzle and multi-tenancy.

## Objective
Implement `buildSystemPrompt` and `askRag` using TDD. All three ports are injected —
no real adapters used here.

## Constraints
- No new `npm` dependencies.
- Do not modify any existing file.
- `topK` is already implemented at `src/infrastructure/search.ts` — import and reuse it.
- All three ports must be injected (not instantiated inside the use case).
- Tests mock all ports — no real `Embedder`, `KBRepository`, or `Generator`.
- Tests written before implementation (TDD).
- All three quality gates must pass: `npm run lint`, `npm run typecheck`, `npm test`.

## Acceptance criteria

### 1. `src/core/use-cases/build-system-prompt.ts`
- Exports `buildSystemPrompt(chunks: EmbeddedChunk[]): string`.
- Returns a string that incorporates each chunk's `content`.
- Pure function — no I/O, no external deps.
- Ported from DataClara's `core/rag/prompts.ts`.

### 2. `src/core/use-cases/ask-rag.ts`
- Exports `askRag(ports: { embedder: Embedder; repository: KBRepository; generator: Generator }, query: string, k: number): Promise<string>`.
- Pipeline (in order):
  1. `embedder.embed(query)` → embedding vector
  2. `repository.getAll()` → all chunks
  3. `topK(vector, chunks, k)` → top-K chunks
  4. `buildSystemPrompt(topChunks)` → system prompt string
  5. `generator.generate(query, systemPrompt)` → answer
  6. Return answer.
- Ported from DataClara's `core/rag/index.ts`.

### 3. Tests

**`src/core/use-cases/build-system-prompt.test.ts`:**
- Given chunks with known `content` values, `buildSystemPrompt` returns a string
  containing each chunk's content.

**`src/core/use-cases/ask-rag.test.ts`:**
- `askRag` calls `embedder.embed` exactly once with the query string.
- `askRag` calls `generator.generate` with the query as first argument and a system
  prompt (string containing chunk content) as second argument.
- `askRag` returns the string returned by the generator mock.

### 4. Quality gates
- `npm run lint` exits 0.
- `npm run typecheck` exits 0.
- `npm test` exits 0 (all existing tests still pass).

## TDD commit sequence
1. `test(use-cases): failing spec`
2. `feat(use-cases): askRag + buildSystemPrompt — tests green`

## Files affected
- `src/core/use-cases/build-system-prompt.ts` — new
- `src/core/use-cases/build-system-prompt.test.ts` — new
- `src/core/use-cases/ask-rag.ts` — new
- `src/core/use-cases/ask-rag.test.ts` — new

No existing files modified.
