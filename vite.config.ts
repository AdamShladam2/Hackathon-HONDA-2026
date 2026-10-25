import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';
import { canvasFeedHandler, canvasProxyHandler } from './server/canvasProxy';
import { integritySummaryHandler } from './server/integritySummary';

// Server routes (also deployed as the Vercel Function in api/server.ts): the Canvas proxy,
// Canvas calendar feeds and the Claude summary for the teacher Integrity Check
function serverRoutes(): Plugin {
  return {
    name: 'collabr-server-routes',
    configureServer(server) {
      server.middlewares.use(canvasProxyHandler);
      server.middlewares.use(canvasFeedHandler);
      server.middlewares.use(integritySummaryHandler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(canvasProxyHandler);
      server.middlewares.use(canvasFeedHandler);
      server.middlewares.use(integritySummaryHandler);
    },
  };
}

export default defineConfig(({ mode }) => {
  // The Claude summary endpoint reads ANTHROPIC_API_KEY from .env on the server only (no VITE_ prefix)
  const env = loadEnv(mode, process.cwd(), '');
  if (env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
  return {
    plugins: [react(), tailwindcss(), serverRoutes()],
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
