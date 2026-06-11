import type { EmbeddedChunk } from '../entities/types.js';

export interface KBRepository {
  getAll(): Promise<EmbeddedChunk[]>;
}
