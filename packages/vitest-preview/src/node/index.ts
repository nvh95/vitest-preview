// https://vitejs.dev/guide/ssr.html#setting-up-the-dev-server
import fs from 'fs';
import http from 'http';
import path from 'path';
import express from 'express';
import { JSDOM } from 'jsdom';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import { fileURLToPath, pathToFileURL } from 'url';

import { openBrowser } from '@vitest-preview/dev-utils';

import { bold, CACHE_FOLDER, green, reset } from '../constants';
import {
  clearCache,
  createCacheFolderIfNeeded,
  findAvailablePort,
  getUrls,
} from '../utils';
import { loadConfig } from '../configure';

const port = process.env.PORT
  ? Number(process.env.PORT)
  : await findAvailablePort(5006);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

createCacheFolderIfNeeded();
const emptyHtml = fs.readFileSync(
  path.resolve(__dirname, 'empty.html'),
  'utf-8',
);
fs.writeFileSync(path.join(CACHE_FOLDER, 'index.html'), emptyHtml);

const snapshotHtmlFile = path.join(CACHE_FOLDER, 'index.html');

interface ServerOptions {
  open?: boolean;
}
interface ServerInstance {
  httpServer: http.Server;
  vite: ViteDevServer;
}

async function createServer(
  options: ServerOptions = { open: true },
): Promise<ServerInstance> {
  const app = express();

  const httpServer = http.createServer(app);
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      host: '0.0.0.0',
      watch: {
        // Helps with atomic write/rename on Linux
        awaitWriteFinish: { stabilityThreshold: 80, pollInterval: 10 },
      },
      hmr: {
        server: httpServer,
      },
    },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  // Watch `snapshotHtmlFile` to trigger reload
  vite.watcher.add(snapshotHtmlFile);

  ['change', 'add', 'unlink'].forEach((event) => {
    vite.watcher.on(event, (file) => {
      if (path.resolve(file) === path.resolve(snapshotHtmlFile)) {
        vite.ws.send({ type: 'full-reload', path: '/' });
      }
    });
  });

  app.get('/', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template = fs.readFileSync(path.resolve(snapshotHtmlFile), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      const dom = new JSDOM(template);
      const { document } = dom.window;

      const processedExternalCss = await processExternalCss(vite);
      // Inject processedExternalCss to different <style> tags
      processedExternalCss.forEach((processedCssObj) => {
        const style = document.createElement('style');
        style.setAttribute('data-vitest-preview-dev-id', processedCssObj.id);
        style.textContent = processedCssObj.css;
        document.head.appendChild(style);
      });

      template = dom.serialize();

      // TODO: We can manipulate the string to modify HTML here. Some actions we can do:
      // - document.title = 'Vitest Preview dashboard' (We can do it by js preview.ts, but it might break some tests)
      // - add <script type="module" src="/src/main.tsx"></script> to add more features to Vitest Preview (e.g: preview multiple snapshots)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      // @ts-ignore
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  httpServer.listen(port, () => {
    const host = (vite.config.server.host || 'localhost').toString();
    const { local, network } = getUrls(host, port);

    console.log(`${bold}Vitest Preview Server is running${reset}`);
    console.log(`  Local:   ${green}${local}${reset}`);
    if (network) console.log(`  Network: ${green}${network}${reset}`);
    if (options.open) openBrowser(local);
  });

  return { httpServer, vite };
}

async function processExternalCss(vite: ViteDevServer) {
  const processedExternalCss = [];
  const config = loadConfig();
  if (!config.externalCss) return [];

  for (const cssFile of config.externalCss) {
    const id = pathToFileURL(path.resolve(cssFile)).href + '?inline';
    try {
      const mod = await vite.ssrLoadModule(id);
      processedExternalCss.push({
        id,
        css: mod.default,
      });
    } catch (error) {
      console.error(error);
      console.error(`Failed to process CSS file: ${cssFile}`);
    }
  }
  return processedExternalCss;
}

function stopServer(serverInstance: ServerInstance): void {
  serverInstance.httpServer.close();
  serverInstance.vite.close();
}

// Register cleanup on exit
function registerCleanup() {
  process.on('exit', clearCache);
  process.on('SIGINT', () => {
    clearCache();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    clearCache();
    process.exit(0);
  });
  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    clearCache();
    process.exit(1);
  });
}

type StartServerOptions = ServerOptions;

async function startServer(options: StartServerOptions = { open: true }) {
  const serverInstance = await createServer({
    open: options.open,
  });
  return serverInstance;
}


export { startServer, stopServer, registerCleanup  };
