// https://vitejs.dev/guide/ssr.html#setting-up-the-dev-server
import fs from 'fs';
import path from 'path';
import express from 'express';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import { fileURLToPath } from 'url';

import { openBrowser } from '@vitest-preview/dev-utils';

import { CACHE_FOLDER } from '../constants';
import { createCacheFolderIfNeeded } from '../utils';

// TODO: Find the available port
const port = process.env.PORT ? Number(process.env.PORT) : 5006;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

createCacheFolderIfNeeded();
const emptyHtml = fs.readFileSync(
  path.resolve(__dirname, 'empty.html'),
  'utf-8',
);
fs.writeFileSync(path.join(CACHE_FOLDER, 'index.html'), emptyHtml);

async function createServer() {
  const app = express();
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      // This does not work on Linux, but work fine on Mac
      // watch: {
      // By default, Vite doesn't watch code under node_modules
      // Reference: https://vitejs.dev/config/server-options.html#server-watch
      // ignored: ['!**/node_modules/.vitest-preview/**'],
      // },
    },
    // Workaround to watch `.vitest-preview`
    // But it still does not work on Linux
    // Reference: https://github.com/vitejs/vite/issues/8619#issuecomment-1170762244
    // plugins: [
    //   {
    //     name: 'watch-node-modules',
    //     configureServer: (server: ViteDevServer): void => {
    //       server.watcher.options = {
    //         ...server.watcher.options,
    //         ignored: [/node_modules\/(?!\.vitest-preview).*/, '**/.git/**'],
    //       };
    //     },
    //   },
    // ],
    // optimizeDeps: {
    //   exclude: ['.vitest-preview'],
    // },
    // TODO: When issue https://github.com/vitejs/vite/issues/8619 closes, we can move .vitest-preview into `node_modules`
    // For now, we workaround by putting it outside node_modules
    // Other option: Can we use Virtual File System? (like previewjs/ how does it work?)
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.get('/', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const snapshotHtmlFile = path.join(CACHE_FOLDER, 'index.html');
      let template = fs.readFileSync(path.resolve(snapshotHtmlFile), 'utf-8');
      template = await vite.transformIndexHtml(url, template);

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

  app.listen(port, () => {
    console.log(`Vitest Preview Server listening on http://localhost:${port}`);
    openBrowser(`http://localhost:${port}`);
  });
}

createServer();
