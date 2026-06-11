export interface Generator {
  generate(prompt: string, system: string): Promise<string>;
}
