---
card_id: 6a2b17241f715907b80f4daa
card_short: "0007"
board_id: 6a296c89a6a64010fc198fc1
---

# 0007 — Concrete Adapters: XenovaEmbedder + AnthropicGenerator

## Context
Phases 0–4 delivered the full domain layer: scaffold, entity types, search, port
interfaces, KB adapter, and use cases. This phase introduces the two concrete adapters
that connect the domain to real external services, making end-to-end RAG possible.
Ported from DataClara's `core/rag/embedder.ts` and `core/rag/generator.ts`.

## Objective
Implement `XenovaEmbedder` and `AnthropicGenerator`, add their dependencies, and
verify with a manual smoke test.

## Constraints
- Project uses ES Modules — all imports must use `.js` extensions.
- No automated tests — these are external wrappers. Quality gates must still pass.
- `ANTHROPIC_API_KEY` must be read from `process.env` — never hardcoded.
- Do not modify any existing file except `package.json` (to add dependencies).
- Single commit.

## Acceptance criteria

### 1. Dependencies — `package.json`
- `@xenova/transformers` added to `dependencies`.
- `@anthropic-ai/sdk` added to `dependencies`.

### 2. `src/adapters/xenova-embedder.ts`
- Exports `XenovaEmbedder implements Embedder`.
- Loads the `Xenova/all-MiniLM-L6-v2` pipeline on construction (or lazily on first call — executor's choice).
- `embed(text: string): Promise<number[]>` returns a normalized vector of length 384.
- Ported from DataClara's `core/rag/embedder.ts`.

### 3. `src/adapters/anthropic-generator.ts`
- Exports `AnthropicGenerator implements Generator`.
- Reads `ANTHROPIC_API_KEY` from `process.env`. Throws a clear error if missing.
- `generate(prompt: string, system: string): Promise<string>` calls the Anthropic API
  using model `claude-sonnet-4-6` and returns the response text.
- Ported from DataClara's `core/rag/generator.ts`.

### 4. Smoke test (manual, not automated)
Running `npm start` (or a temporary script) must:
- Instantiate `XenovaEmbedder`, embed a short query, and log the embedding length (expect 384).
- Run `topK` over the static KB and log the top-3 chunk sources and scores.
- Executor verifies this output before committing.

### 5. Quality gates
- `npm run lint` exits 0.
- `npm run typecheck` exits 0.
- `npm test` exits 0 (no existing tests broken).

## Files affected
- `package.json` — add `@xenova/transformers` and `@anthropic-ai/sdk` to dependencies
- `src/adapters/xenova-embedder.ts` — new
- `src/adapters/anthropic-generator.ts` — new

No other files modified.
