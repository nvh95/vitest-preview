import path from 'path';
import os from 'os';

const base64CurrentLocation = Buffer.from(process.cwd()).toString('base64url');

export const CACHE_FOLDER = path.join(
  os.tmpdir(),
  'vitest-preview',
  base64CurrentLocation,
);
