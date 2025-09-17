import path from 'path';
import os from 'os';

export const CACHE_FOLDER = path.join(os.tmpdir(), 'vitest-preview');
