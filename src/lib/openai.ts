import OpenAI from 'openai';
import { useSettings } from '../store/settings';
import { useProfile, ageFromProfile } from '../store/profile';
import type { AilmentContent } from './content';

export class MissingKeyError extends Error {
  constructor() {
    super('OpenAI API key not set. Add it in Settings.');
  }
}

function client() {
  const key = useSettings.getState().openaiKey.trim();
  if (!key) throw new MissingKeyError();
  return new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
}

export type ChatMsg = { role: 'user' | 'assistant'; content: string };

export function buildSystemPrompt(opts: { ailment?: AilmentContent | null }): string {
  const p = useProfile.getState().profile;
  const profileLine = p
    ? `User: ${p.name}, age ${ageFromProfile(p)}, ${p.gender}.`
    : 'User profile unknown.';
  const base = [
    'You are a friendly health educator helping an Indian user understand common ailments.',
    profileLine,
    'Use Indian food and lifestyle examples. Reply in plain English, short (3-6 sentences), avoid medical jargon.',
    'Never replace doctor advice. If user mentions red-flag symptoms (severe pain, blood, breathing trouble, fainting), tell them to see a doctor immediately.',
  ];
  if (opts.ailment) {
    base.push(
      `Current topic: ${opts.ailment.title}. Context: ${opts.ailment.oneLiner}`,
      `Key facts: ${opts.ailment.cards.slice(0, 5).map((c) => c.title + ' - ' + c.body).join(' | ')}`,
    );
  } else {
    base.push('Topics covered: diabetes, thyroid, cholesterol, blood pressure, fatty liver, kidney stones, gall bladder stones, UTI, PCOD/PCOS.');
  }
  return base.join('\n');
}

export async function streamChat(
  system: string,
  history: ChatMsg[],
  onDelta: (chunk: string) => void,
): Promise<string> {
  const c = client();
  const stream = await c.chat.completions.create({
    model: 'gpt-4o-mini',
    stream: true,
    messages: [{ role: 'system', content: system }, ...history],
  });
  let full = '';
  for await (const part of stream) {
    const delta = part.choices?.[0]?.delta?.content ?? '';
    if (delta) {
      full += delta;
      onDelta(delta);
    }
  }
  return full;
}

export async function testKey(): Promise<{ ok: boolean; error?: string }> {
  try {
    const c = client();
    await c.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 5,
      messages: [{ role: 'user', content: 'ping' }],
    });
    return { ok: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: msg };
  }
}
