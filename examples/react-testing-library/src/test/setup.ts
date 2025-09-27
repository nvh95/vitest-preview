import '@testing-library/jest-dom/vitest';
import { configure } from 'vitest-preview';

// Import global css to use with vitest-preview
import '../index.css';

import { beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { debug } from 'vitest-preview';

configure({
  externalCss: ['src/background.css'],
});

// Added by vitest-preview automatic mode setup
beforeEach((ctx) => {
  ctx.onTestFinished(({ task }) => {
    if (task?.result?.state === 'fail') {
      // Preview the failed test in the Vitest Preview Dashboard
      debug();
    }
    // Still perform cleanup, but after capturing the DOM state
    cleanup();
  });
});
