import { describe, it, expect } from 'vitest';
import { dotProduct, topK } from './search.js';
import type { EmbeddedChunk } from '../core/entities/types.js';

const chunk = (id: string, embedding: number[]): EmbeddedChunk => ({
  id, source: 's', heading: 'h', content: 'c', embedding,
});

describe('dotProduct', () => {
  it('returns the correct scalar for two known vectors', () => {
    expect(dotProduct([1, 0, 0], [0, 1, 0])).toBe(0);
    expect(dotProduct([1, 2, 3], [4, 5, 6])).toBe(32);
    expect(dotProduct([0.6, 0.8, 0], [0.8, 0.6, 0])).toBeCloseTo(0.96);
  });
});

describe('topK', () => {
  const chunks = [
    chunk('a', [1, 0, 0]),
    chunk('b', [0, 1, 0]),
    chunk('c', [0, 0, 1]),
  ];

  it('returns results sorted by descending score', () => {
    const results = topK([0.9, 0.1, 0], chunks, 3);
    expect(results[0].score).toBeGreaterThan(results[1].score);
    expect(results[1].score).toBeGreaterThan(results[2].score);
  });

  it('returns at most k results', () => {
    expect(topK([1, 0, 0], chunks, 2)).toHaveLength(2);
  });

  it('does not mutate the input array', () => {
    const snapshot = [...chunks];
    topK([1, 0, 0], chunks, 3);
    expect(chunks).toEqual(snapshot);
  });
});
