import path from 'path';
import os from 'os';

export const CACHE_FOLDER = path.join(os.tmpdir(), 'vitest-preview');

export const green = '\x1b[32m';
export const bold = '\x1b[1m';
export const reset = '\x1b[0m';
