import Anthropic from '@anthropic-ai/sdk';
import type { IncomingMessage, ServerResponse } from 'http';

// POST /api/integrity-summary — asks Claude to summarize the integrity signals the app already
// computed for one class post. The API key stays on this server (ANTHROPIC_API_KEY in .env or
// an `ant auth login` profile). Without one the endpoint returns 503 and the app shows its
// built-in summary instead.

const SYSTEM_PROMPT = `You help a university instructor decide which student work in their own course deserves a closer look for academic integrity.
You receive signals computed from a group's Google Doc version history, peer ratings and text-overlap checks, with a 0-100 likelihood score per student.
Write a short summary (3 to 5 sentences, plain text, no headings or lists) for the instructor:
- Say which students, if any, the signals point to and which specific signals matter most.
- Mention innocent explanations a signal could have (for example, pasting from the student's own notes or another doc).
- Recommend a proportionate next step, such as asking the student to walk through their section or show their notes.
Use only the facts provided. The score is a likelihood that the work needs review, not proof of cheating; never state that a student cheated.`;

const MAX_BODY_BYTES = 64 * 1024;

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

let client: Anthropic | null = null;

export const integritySummaryHandler = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
  if (req.url !== '/api/integrity-summary') return next();
  res.setHeader('Content-Type', 'application/json');
  const send = (status: number, body: object) => {
    res.statusCode = status;
    res.end(JSON.stringify(body));
  };

  if (req.method !== 'POST') return send(405, { error: 'Use POST' });

  let check: unknown;
  try {
    check = JSON.parse(await readBody(req));
  } catch {
    return send(400, { error: 'Expected a JSON body' });
  }

  try {
    client ??= new Anthropic();
    const response = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 4000,
      output_config: { effort: 'low' },
      // On a safety decline, the API reruns the request on a fallback model
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Integrity signals for one class post, as JSON:\n\n${JSON.stringify(check, null, 2)}`,
        },
      ],
    });

    if (response.stop_reason === 'refusal') return send(502, { error: 'Claude declined to summarize this check' });
    const text = response.content
      .flatMap((b) => (b.type === 'text' ? [b.text] : []))
      .join('\n')
      .trim();
    if (!text) return send(502, { error: 'Claude returned no summary' });
    send(200, { summary: text, model: response.model });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) return send(503, { error: 'Claude is not configured on this server' });
    if (err instanceof Anthropic.RateLimitError) return send(429, { error: 'Claude is busy, try again shortly' });
    if (err instanceof Anthropic.APIError && err.status) return send(502, { error: `Claude API error ${err.status}` });
    // No credentials found, or the network is unreachable
    send(503, { error: 'Claude is not available on this server' });
  }
};
