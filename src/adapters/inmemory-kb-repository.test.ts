import { describe, it, expect } from 'vitest';
import { InMemoryKBRepository } from './inmemory-kb-repository.js';
import { topK } from '../infrastructure/search.js';

describe('InMemoryKBRepository', () => {
  it('getAll() returns the correct number of chunks', async () => {
    const repo = new InMemoryKBRepository();
    const chunks = await repo.getAll();
    expect(chunks).toHaveLength(5);
  });

  it('every chunk has fields of the correct types', async () => {
    const repo = new InMemoryKBRepository();
    const chunks = await repo.getAll();
    for (const chunk of chunks) {
      expect(typeof chunk.id).toBe('string');
      expect(typeof chunk.source).toBe('string');
      expect(typeof chunk.heading).toBe('string');
      expect(typeof chunk.content).toBe('string');
      expect(Array.isArray(chunk.embedding)).toBe(true);
      expect(chunk.embedding.every(v => typeof v === 'number')).toBe(true);
    }
  });

  it('topK returns the business_info chunk as top result for its embedding', async () => {
    const repo = new InMemoryKBRepository();
    const chunks = await repo.getAll();
    const results = topK([1, 0, 0, 0, 0], chunks, 1);
    expect(results).toHaveLength(1);
    expect(results[0].chunk.source).toBe('business_info');
  });
});
