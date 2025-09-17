import fs from 'fs';
import { CACHE_FOLDER } from './constants';

// Create cache folder if it doesn't exist
export function createCacheFolderIfNeeded() {
  if (!fs.existsSync(CACHE_FOLDER)) {
    fs.mkdirSync(CACHE_FOLDER, {
      recursive: true,
    });
  }
}

export function clearCache() {
  if (fs.existsSync(CACHE_FOLDER)) {
    fs.rmSync(CACHE_FOLDER, { recursive: true, force: true });
  }
}

import net from 'net';

export async function findAvailablePort(
  start = 5006,
  max = 65535,
): Promise<number> {
  function check(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = net
        .createServer()
        .once('error', () => resolve(false))
        .once('listening', () => {
          server.close();
          resolve(true);
        })
        .listen(port);
    });
  }

  for (let port = start; port <= max; port++) {
    if (await check(port)) {
      return port;
    }
  }
  throw new Error(`No available port between ${start} and ${max}`);
}
