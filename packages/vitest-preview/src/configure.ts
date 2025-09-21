import fs from 'fs';
import path from 'path';
import { CACHE_FOLDER } from './constants';
import { createCacheFolderIfNeeded } from './utils';

export interface ConfigureOptions {
  externalCss?: string[];
}

export interface Config {
  externalCss?: string[];
}

const CONFIG_FILE_NAME = 'vitest-preview.config.json';
const configPath = path.join(CACHE_FOLDER, CONFIG_FILE_NAME);

export function configure(options: ConfigureOptions) {
  if (options.externalCss) {
    // Check if the file exists
    options.externalCss.forEach((cssFile) => {
      if (!fs.existsSync(cssFile)) {
        throw new Error(`File ${path.resolve(cssFile)} does not exist
Please check your Vitest Preview configuration.
Make sure externalCss path is relative to your current working directory`);
      }
    });
  }
  createCacheFolderIfNeeded();
  fs.writeFileSync(configPath, JSON.stringify(options));
}

export function loadConfig(): Config {
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  return {};
}
