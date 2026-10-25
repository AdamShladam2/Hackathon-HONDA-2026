import type { IncomingMessage, ServerResponse } from 'http';
import { canvasFeedHandler, canvasProxyHandler } from '../server/canvasProxy.js';
import { integritySummaryHandler } from '../server/integritySummary.js';

// Vercel Function for the server routes the Vite dev server runs as middleware (see vite.config.ts).
// vercel.json rewrites /canvas-proxy/*, /canvas-feed and /api/integrity-summary here; req.url keeps
// the original path, so the same handlers pick the request up.
const handlers = [canvasProxyHandler, canvasFeedHandler, integritySummaryHandler];

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  for (const route of handlers) {
    let passed = false;
    await route(req, res, () => {
      passed = true;
    });
    if (!passed) return;
  }
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Not found' }));
}
