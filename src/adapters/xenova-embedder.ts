import type { Embedder } from '../core/ports/embedder.port.js';

type EmbedFn = (text: string, options: Record<string, unknown>) => Promise<{ data: Float32Array }>;

export class XenovaEmbedder implements Embedder {
  private pipe: EmbedFn | null = null;

  async embed(text: string): Promise<number[]> {
    if (!this.pipe) {
      const { pipeline } = await import('@xenova/transformers');
      this.pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2') as unknown as EmbedFn;
    }
    const output = await this.pipe(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }
}
