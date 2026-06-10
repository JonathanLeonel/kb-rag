import type { EmbeddedChunk, SearchResult } from '../core/entities/types.js';

export function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

export function topK(query: number[], chunks: EmbeddedChunk[], k: number): SearchResult[] {
  return [...chunks]
    .map(chunk => ({ chunk, score: dotProduct(query, chunk.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
