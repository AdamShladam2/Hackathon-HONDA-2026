import type { IncomingMessage, ServerResponse } from 'http';

// Canvas's REST API doesn't allow browser cross-origin requests, so the app calls
// /canvas-proxy/<canvas host>/api/v1/... and this server forwards it.
// Only read-only (GET) API calls to Canvas hosts are forwarded.
// Matches BLOCKED_EMAIL_DOMAINS in src/services/campusAccess.ts
const BLOCKED_HOSTS = ['umich.edu', 'michigan.edu', 'umich.instructure.com'];

function isAllowedCanvasHost(host: string): boolean {
  if (BLOCKED_HOSTS.some((b) => host === b || host.endsWith(`.${b}`))) return false;
  return /^([a-z0-9-]+\.)+instructure\.com$/.test(host) || /^([a-z0-9-]+\.)+edu$/.test(host);
}

export const canvasProxyHandler = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
  if (!req.url?.startsWith('/canvas-proxy/')) return next();

  const rest = req.url.slice('/canvas-proxy/'.length);
  const slash = rest.indexOf('/');
  const host = (slash === -1 ? rest : rest.slice(0, slash)).toLowerCase();
  const apiPath = slash === -1 ? '/' : rest.slice(slash);
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET' || !isAllowedCanvasHost(host) || !apiPath.startsWith('/api/v1/')) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Unsupported Canvas proxy request' }));
    return;
  }
  const auth = req.headers.authorization;
  if (!auth) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Missing Canvas access token' }));
    return;
  }

  try {
    const upstream = await fetch(`https://${host}${apiPath}`, {
      headers: { Authorization: auth, Accept: 'application/json' },
      redirect: 'manual',
    });
    res.statusCode = upstream.status;
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    // Canvas paginates with a Link header; pass it through for the client to follow
    const link = upstream.headers.get('link');
    if (link) res.setHeader('X-Canvas-Link', link);
    res.end(Buffer.from(await upstream.arrayBuffer()));
  } catch (err) {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: `Could not reach ${host}` }));
  }
};

// Canvas calendar feeds (Calendar → Calendar Feed) need no token. The feed link is sent in the
// X-Canvas-Feed-Url header so it stays out of URLs and logs; only *.ics feed paths are fetched.
export const canvasFeedHandler = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
  if (req.url !== '/canvas-feed') return next();

  let feedUrl: URL | null = null;
  try {
    feedUrl = new URL(String(req.headers['x-canvas-feed-url'] || ''));
  } catch {
    feedUrl = null;
  }
  if (
    req.method !== 'GET' ||
    !feedUrl ||
    feedUrl.protocol !== 'https:' ||
    !isAllowedCanvasHost(feedUrl.hostname.toLowerCase()) ||
    !/^\/feeds\/calendars\/[^/]+\.ics$/.test(feedUrl.pathname)
  ) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'That is not a Canvas calendar feed link.' }));
    return;
  }

  try {
    const upstream = await fetch(feedUrl.href, { headers: { Accept: 'text/calendar' } });
    if (!isAllowedCanvasHost(new URL(upstream.url).hostname.toLowerCase())) throw new Error('redirected');
    res.statusCode = upstream.status;
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'text/calendar');
    res.end(Buffer.from(await upstream.arrayBuffer()));
  } catch {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: `Could not reach ${feedUrl.hostname}` }));
  }
};
