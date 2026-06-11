import type { Embedder } from '../ports/embedder.port.js';
import type { KBRepository } from '../ports/kb-repository.port.js';
import type { Generator } from '../ports/generator.port.js';
import { topK } from '../../infrastructure/search.js';
import { buildSystemPrompt } from './build-system-prompt.js';

export async function askRag(
  ports: { embedder: Embedder; repository: KBRepository; generator: Generator },
  query: string,
  k: number
): Promise<string> {
  const vector = await ports.embedder.embed(query);
  const chunks = await ports.repository.getAll();
  const topChunks = topK(vector, chunks, k).map(r => r.chunk);
  const systemPrompt = buildSystemPrompt(topChunks);
  return ports.generator.generate(query, systemPrompt);
}
