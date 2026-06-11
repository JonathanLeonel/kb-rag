import type { EmbeddedChunk } from '../entities/types.js';

export function buildSystemPrompt(chunks: EmbeddedChunk[]): string {
  return chunks.map(c => c.content).join('\n\n');
}
