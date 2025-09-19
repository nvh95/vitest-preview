import fs from 'fs';
import os from 'os';
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

// Pretty print URLs (local + LAN)
export function getUrls(host: string, port: number) {
  const protocol = 'http';
  const isAnyHost =
    host === '0.0.0.0' ||
    host === '::' ||
    host === '::1' ||
    host === '' ||
    host === '0';
  const displayHost = isAnyHost ? 'localhost' : host;
  const local = `${protocol}://${displayHost}:${port}/`;

  let network: string | null = null;
  if (isAnyHost) {
    const nets = os.networkInterfaces();
    for (const addrs of Object.values(nets)) {
      for (const a of addrs ?? []) {
        if (a.family === 'IPv4' && !a.internal) {
          network = `${protocol}://${a.address}:${port}/`;
          break;
        }
      }
      if (network) break;
    }
  }
  return { local, network };
}
