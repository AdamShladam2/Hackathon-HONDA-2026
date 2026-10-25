import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';
import {defineConfig, type Plugin} from 'vite';

// Canvas's REST API doesn't allow browser cross-origin requests, so the app calls
// /canvas-proxy/<canvas host>/api/v1/... and this dev/preview server forwards it.
// Only read-only (GET) API calls to Canvas hosts are forwarded.
function isAllowedCanvasHost(host: string): boolean {
  return /^([a-z0-9-]+\.)+instructure\.com$/.test(host) || /^([a-z0-9-]+\.)+edu$/.test(host);
}

function canvasApiProxy(): Plugin {
  const handler = async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
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

  return {
    name: 'canvas-api-proxy',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), canvasApiProxy()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
