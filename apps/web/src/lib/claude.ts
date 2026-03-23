import Anthropic from '@anthropic-ai/sdk';

/** Anthropic Claude client for AI coaching features */
export const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
