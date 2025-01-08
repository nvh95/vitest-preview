import fs from 'fs';
import path from 'path';
import { CACHE_FOLDER } from './constants';
import { createCacheFolderIfNeeded, getCssFileConfig } from './utils';

export function debug(): void {
  createCacheFolderIfNeeded();

  const cssFile = getCssFileConfig();
  if (cssFile) {
    const head = document.documentElement.querySelector('head');
    if (head) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/__vitest-preview.css';
      head.appendChild(link);
    }
  }

  fs.writeFileSync(
    path.join(CACHE_FOLDER, 'index.html'),
    document.documentElement.outerHTML,
  );
}
