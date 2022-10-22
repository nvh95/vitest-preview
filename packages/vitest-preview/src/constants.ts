import path from 'path';

export const CACHE_FOLDER = path.join(
  process.cwd(),
  'node_modules',
  '.vitest-preview',
);
