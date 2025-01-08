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

export function getCssFileConfig() {
  const commandLineArgs = process.argv.slice(2);
  const cssFile = commandLineArgs.find((arg) => arg.startsWith('--css='))?.split('=')[1] || null;

  return cssFile;
}
