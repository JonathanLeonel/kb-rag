import Anthropic from '@anthropic-ai/sdk';
import type { Generator } from '../core/ports/generator.port.js';

export class AnthropicGenerator implements Generator {
  private client: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
    this.client = new Anthropic({ apiKey });
  }

  async generate(prompt: string, system: string): Promise<string> {
    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: prompt }],
    });
    const block = message.content[0];
    if (block.type !== 'text') throw new Error('Unexpected response type');
    return block.text;
  }
}
