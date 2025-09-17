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

const snapshotHtmlFile = path.join(CACHE_FOLDER, 'index.html');

async function createServer() {
  const app = express();
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      watch: {
        // By default, vite watch the root, but we only need to watch `snapshotHtmlFile`
        // Probably needs to add more in the future
        ignored: function (filePath: string) {
          return path.resolve(filePath) !== snapshotHtmlFile;
        },
      },
    },
    // TODO: When issue https://github.com/vitejs/vite/issues/8619 closes, we can move .vitest-preview into `node_modules`
    // For now, we workaround by putting it outside node_modules
    // Other option: Can we use Virtual File System? (like previewjs/ how does it work?)
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
