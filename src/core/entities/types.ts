export interface Chunk {
  id: string;
  source: string;
  heading: string;
  content: string;
}

export interface EmbeddedChunk extends Chunk {
  embedding: number[];
}

export interface SearchResult {
  chunk: EmbeddedChunk;
  score: number;
}
