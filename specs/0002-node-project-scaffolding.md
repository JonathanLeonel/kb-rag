---
card_id: 6a297d36c174477f4fa1eb01
card_short: 0002
board_id: 6a296c89a6a64010fc198fc1
---

## Context

`@jonathanleonel/kb-rag` is a lightweight RAG package extracted from DataClara — an omnichannel e-commerce management SaaS. It will be published to npm as a portfolio piece demonstrating Clean Architecture + TDD in a real-world AI context.

This card establishes the project toolchain. Nothing can be built until `npm test`, `npm run lint`, and `npm run typecheck` are wired up and green. The README already exists at the repo root and is not part of this card.

## Objective

Create a minimal but complete Node/TypeScript project scaffold so that all three quality gates pass on a clean checkout:

```
npm run lint
npm run typecheck
npm test
```

## Acceptance criteria

1. `package.json` present with:
   - `"name": "@jonathanleonel/kb-rag"`
   - Scripts: `test`, `lint`, `typecheck`, `build`, `start`
2. `tsconfig.json` — TypeScript 5, `strict: true`, targets ESNext/Node
3. `vitest.config.ts` — minimal config; `npm test` exits 0 (empty suite, no failures)
4. `eslint.config.js` (flat config) — typescript-eslint; `npm run lint` exits 0
5. `npm run typecheck` exits 0
6. `.gitignore` — includes `node_modules/`, `dist/`, `.env`
7. `src/index.ts` — stub file (`export {}`) so TypeScript has an entry point

## Script values

| Script | Command |
|---|---|
| `test` | `vitest run` |
| `lint` | `eslint .` |
| `typecheck` | `tsc --noEmit` |
| `build` | `tsc` |
| `start` | `tsx src/index.ts` |

## Constraints

- Dev dependencies only: `typescript`, `vitest`, `tsx`, `eslint`, `typescript-eslint`
- Do **not** install `@xenova/transformers` or `@anthropic-ai/sdk` — those come in Phase 5
- `"name"` in `package.json` must be `@jonathanleonel/kb-rag` verbatim
- Do not modify `README.md`
- ESLint flat config (`eslint.config.js`), not legacy `.eslintrc`

## Files affected

| File | Action |
|---|---|
| `package.json` | Create |
| `tsconfig.json` | Create |
| `vitest.config.ts` | Create |
| `eslint.config.js` | Create |
| `.gitignore` | Create |
| `src/index.ts` | Create (stub) |
