import fs from 'fs';
import path from 'path';
import { CACHE_FOLDER } from './constants';
import { createCacheFolderIfNeeded, wait } from './utils';
import { afterEach, beforeEach } from 'vitest';

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

interface WatchOptions {
  throttle?: number | null;
  start?: boolean;
  end?: boolean;
  debug?: boolean;
}

/**
 * Watches for changes in the document and automatically calls debug() when changes occur.
 * Uses MutationObserver to detect DOM mutations.
 *
 * @param options - Configuration options for the observer
 * @param options.throttle - Time in milliseconds to throttle debug calls (default: 50). Set to null to disable throttling.
 * @param options.start - Whether to call debug immediately when watch is started (default: true)
 * @param options.end - Whether to call debug one final time before stopping watching (default: true)
 * @param options.debug - Whether to log the total number of debug calls to the console (default: false)
 * @returns A function to stop watching
 */
export function watch(options: WatchOptions = {}): () => void {
  // Stop any existing observer
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // Set up throttling to avoid too many debug() calls
  const throttleTime = options.throttle === undefined ? 50 : options.throttle;
  const start = options.start ?? true;
  const end = options.end ?? true;
  const debugFlag = options.debug ?? false;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  console.log('throttleTime', throttleTime);
  let totalCalls = 0;
  if (start) {
    debug();
    totalCalls++;
  }

  let lastCall = 0;
  // Create a new observer
  observer = new MutationObserver(() => {
    // Throttle debug calls
    if (throttleTime === null) {
      debug();
      totalCalls++;
      return;
    } else {
      const now = Date.now();
      if (now - lastCall > throttleTime) {
        debug();
        lastCall = now;
        totalCalls++;
      }
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
    // Capture one final state if requested
    if (end) {
      debug();
    }
    if (debugFlag) {
      console.log('totalCalls', ++totalCalls);
    }

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

export function autoPreviewOnDomChanges(options?: WatchOptions) {
  let stopWatching: (() => void) | null = null;
  beforeEach(() => {
    stopWatching = watch(options);
  });

  afterEach(() => {
    stopWatching?.();
  });
}
