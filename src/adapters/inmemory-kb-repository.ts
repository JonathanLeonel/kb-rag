import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { EmbeddedChunk } from '../core/entities/types.js';
import type { KBRepository } from '../core/ports/kb-repository.port.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class InMemoryKBRepository implements KBRepository {
  private chunks: EmbeddedChunk[] = [];

  constructor() {
    const raw = readFileSync(join(__dirname, '../infrastructure/kb/data.json'), 'utf-8');
    this.chunks = JSON.parse(raw) as EmbeddedChunk[];
  }

  async getAll(): Promise<EmbeddedChunk[]> {
    return this.chunks;
  }
}
