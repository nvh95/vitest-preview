import fs from 'fs';
import path from 'path';
import { CACHE_FOLDER } from './constants';
import { createCacheFolderIfNeeded } from './utils';

let observer: MutationObserver | null = null;

/**
 * Materialize CSSOM-inserted rules into textContent for <style> tags
 * that currently look empty.
 */
export function materializeCssomIntoText() {
  const styles = document.querySelectorAll<HTMLStyleElement>('style');
  for (let i = 0; i < styles.length; i++) {
    const styleElement = styles[i];

    // Skip if it already has non-whitespace text
    const hadText =
      !!styleElement.textContent && styleElement.textContent.trim().length > 0;
    if (hadText) continue;

    // Try to read CSSOM and write once
    const sheet = styleElement.sheet as CSSStyleSheet | null;
    if (!sheet) continue;

    try {
      const rules = sheet.cssRules; // may throw for cross-origin (rare for <style>)
      const out = new Array<string>(rules.length);
      for (let j = 0; j < rules.length; j++) out[j] = rules[j].cssText;
      styleElement.textContent = out.join('\n');
    } catch {
      // ignore unreadable sheets
    }
  }
}

export function debug(): void {
  materializeCssomIntoText();

  createCacheFolderIfNeeded();

  fs.writeFileSync(
    path.join(CACHE_FOLDER, 'index.html'),
    document.documentElement.outerHTML,
  );
}

/**
 * Watches for changes in the document and automatically calls debug() when changes occur.
 * Uses MutationObserver to detect DOM mutations.
 * 
 * @param options - Configuration options for the observer
 * @param options.throttle - Time in milliseconds to throttle debug calls (default: 100)
 * @returns A function to stop watching
 */
export function watch(options: { throttle?: number } = {}): () => void {
  // Stop any existing observer
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // Set up throttling to avoid too many debug() calls
  const throttleTime = options.throttle ?? 100;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  // Create a new observer
  observer = new MutationObserver(() => {
    // Throttle debug calls
    if (timeout === null) {
      timeout = setTimeout(() => {
        debug();
        timeout = null;
      }, throttleTime);
    }
  });

  // Start observing the document for all types of mutations
  observer.observe(document, {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
  });

  // Return a function to stop watching
  return () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
}
