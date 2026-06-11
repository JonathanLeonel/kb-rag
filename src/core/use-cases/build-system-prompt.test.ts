import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from './build-system-prompt.js';
import type { EmbeddedChunk } from '../entities/types.js';

const makeChunk = (content: string): EmbeddedChunk => ({
  id: 'x',
  source: 'test',
  heading: 'h',
  content,
  embedding: [],
});

describe('buildSystemPrompt', () => {
  // Edge cases

  it('empty chunk array → returns empty string', () => {
    expect(buildSystemPrompt([])).toBe('');
  });

  it('chunk with empty content → does not throw and returns a valid string', () => {
    expect(() => buildSystemPrompt([makeChunk('')])).not.toThrow();
    expect(buildSystemPrompt([makeChunk('')])).toBe('');
  });

  it('single chunk → result equals the chunk content exactly', () => {
    expect(buildSystemPrompt([makeChunk('Only context')])).toBe('Only context');
  });

  // Happy path

  it('multiple chunks → each content is present as a distinct section', () => {
    const chunks = [makeChunk('Alpha context'), makeChunk('Beta context')];
    const result = buildSystemPrompt(chunks);
    const sections = result.split('\n\n');
    expect(sections).toContain('Alpha context');
    expect(sections).toContain('Beta context');
  });
});
