---
card_id: 6a29f5d52236ebc4bdd6ea63
card_short: "0004"
board_id: 6a296c89a6a64010fc198fc1
---

# 0004 — Phase 2: Ports

## Context
Phases 0 and 1 delivered the project scaffold and the core entities/search function.
This phase defines the three port interfaces that decouple the core domain from any
concrete implementation. They form the contract between `core/` and `adapters/`.

## Objective
Create three TypeScript interface files under `src/core/ports/`. No logic, no external
dependencies, no tests required.

## Constraints
- `EmbeddedChunk` is already exported from `src/core/entities/types.ts` — import it,
  do not redefine it.
- No `I` prefix on interface names. Naming convention: abstract noun for the port,
  "how" prefix for implementations (e.g. `XenovaEmbedder`).
- Do not add any new `npm` dependencies.
- Do not modify any existing file.
- All three quality gates must pass unchanged: `npm run lint`, `npm run typecheck`,
  `npm test`.
- Single commit.

## Acceptance criteria
1. `src/core/ports/embedder.port.ts` — exports:
   ```ts
   export interface Embedder {
     embed(text: string): Promise<number[]>;
   }
   ```
2. `src/core/ports/generator.port.ts` — exports:
   ```ts
   export interface Generator {
     generate(prompt: string, system: string): Promise<string>;
   }
   ```
3. `src/core/ports/kb-repository.port.ts` — exports:
   ```ts
   import { EmbeddedChunk } from '../entities/types';

   export interface KBRepository {
     getAll(): Promise<EmbeddedChunk[]>;
   }
   ```
4. `npm run lint` exits 0.
5. `npm run typecheck` exits 0.
6. `npm test` exits 0 (no existing tests broken).

## Files affected
- `src/core/ports/embedder.port.ts` — new
- `src/core/ports/generator.port.ts` — new
- `src/core/ports/kb-repository.port.ts` — new

No other files touched.
