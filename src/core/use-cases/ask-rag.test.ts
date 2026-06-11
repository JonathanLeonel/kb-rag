import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mocked } from 'vitest';
import { askRag } from './ask-rag.js';
import type { EmbeddedChunk } from '../entities/types.js';
import type { Embedder } from '../ports/embedder.port.js';
import type { KBRepository } from '../ports/kb-repository.port.js';
import type { Generator } from '../ports/generator.port.js';

const chunk: EmbeddedChunk = {
  id: '1',
  source: 'doc',
  heading: 'h',
  content: 'relevant content',
  embedding: [1, 0],
};

describe('askRag', () => {
  let embedder: Mocked<Embedder>;
  let repository: Mocked<KBRepository>;
  let generator: Mocked<Generator>;

  beforeEach(() => {
    embedder = { embed: vi.fn().mockResolvedValue([1, 0]) };
    repository = { getAll: vi.fn().mockResolvedValue([chunk]) };
    generator = { generate: vi.fn().mockResolvedValue('answer') };
  });

  // Edge cases

  it('empty repository → generator.generate is still called with an empty system prompt', async () => {
    repository.getAll.mockResolvedValue([]);

    await askRag({ embedder, repository, generator }, 'my query', 1);

    expect(generator.generate).toHaveBeenCalledOnce();
    const [, systemPrompt] = generator.generate.mock.calls[0];
    expect(systemPrompt).toBe('');
  });

  it('k greater than available chunks → does not throw and returns the answer', async () => {
    const result = await askRag({ embedder, repository, generator }, 'my query', 100);

    expect(result).toBe('answer');
  });

  it('k=0 → generator.generate is called with an empty system prompt', async () => {
    await askRag({ embedder, repository, generator }, 'my query', 0);

    expect(generator.generate).toHaveBeenCalledOnce();
    const [, systemPrompt] = generator.generate.mock.calls[0];
    expect(systemPrompt).toBe('');
  });

  // Happy path

  it('calls embedder.embed exactly once with the query', async () => {
    await askRag({ embedder, repository, generator }, 'my query', 1);

    expect(embedder.embed).toHaveBeenCalledOnce();
    expect(embedder.embed).toHaveBeenCalledWith('my query');
  });

  it('calls repository.getAll exactly once', async () => {
    await askRag({ embedder, repository, generator }, 'my query', 1);

    expect(repository.getAll).toHaveBeenCalledOnce();
  });

  it('calls generator.generate with query and a system prompt containing chunk content', async () => {
    await askRag({ embedder, repository, generator }, 'my query', 1);

    expect(generator.generate).toHaveBeenCalledOnce();
    const [firstArg, secondArg] = generator.generate.mock.calls[0];
    expect(firstArg).toBe('my query');
    expect(secondArg).toContain('relevant content');
  });

  it('returns the string from the generator', async () => {
    generator.generate.mockResolvedValue('final answer');

    const result = await askRag({ embedder, repository, generator }, 'my query', 1);

    expect(result).toBe('final answer');
  });
});
