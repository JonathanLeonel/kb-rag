import { XenovaEmbedder } from '../src/adapters/xenova-embedder.js';
import { InMemoryKBRepository } from '../src/adapters/inmemory-kb-repository.js';
import { topK } from '../src/infrastructure/search.js';

const embedder = new XenovaEmbedder();
const query = 'What is RAG?';

console.log('Embedding query...');
const embedding = await embedder.embed(query);
console.log('Embedding length:', embedding.length);

const repo = new InMemoryKBRepository();
const chunks = await repo.getAll();
const results = topK(embedding, chunks, 3);

console.log('Top 3 results:');
results.forEach(r => console.log(`  source: ${r.chunk.source}, score: ${r.score.toFixed(4)}`));
