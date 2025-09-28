# Auto Preview on Failed Tests

While manually calling `debug()` in your tests gives you precise control over when to capture the DOM state, sometimes you want to automatically capture the UI state when a test fails. This can be especially helpful for debugging test failures in CI environments or when running large test suites.

This guide shows two approaches to set up **Auto Preview on Failed Tests**, which automatically previews the UI of failed tests without the need to manually call `debug()` in each test.

## Configure Auto Preview on Failed Tests using the CLI

You can run the following command to set up **Auto Preview on Failed Tests** with minimal effort:

```bash
vitest-preview setup --automaticMode
```

However, it is important to carefully review this guide to ensure that Auto Preview on Failed Tests is configured properly for your specific setup.

## Approach 1: Using `onTestFinished` Hook (Recommended)

Vitest provides a powerful test context API that allows you to hook into the test lifecycle. You can use the `onTestFinished` hook to call `debug()` automatically when a test fails.

### Step 1: Disable Automatic Cleanup

If you're using Testing Library, you need to disable [automatic cleanup](https://testing-library.com/docs/react-testing-library/setup/#auto-cleanup-in-vitest) first. Otherwise, the DOM will be cleaned up before you can capture it with `debug()`.

```diff
// vitest.config.ts/ vite.config.ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vitest';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
-    globals: true,
  },
});
```

Also, make sure your test setup file does not perform automatic cleanup

```diff
// setupFiles.ts
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
-  cleanup()
})
```

### Step 2: Add the `onTestFinished` Hook

Add the following code to your test setup file (e.g., `src/test/setup.ts` or the file specified in your Vitest config's `setupFiles`):

```js
// setupFiles.ts
import { beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { debug } from 'vitest-preview';

beforeEach((ctx) => {
  ctx.onTestFinished(({ task }) => {
    if (task?.result?.state === 'fail') {
      // Preview the failed test in the Vitest Preview Dashboard
      debug();
    }
    // Still perform cleanup, but after capturing the DOM state. It depends on which cleanup strategy you use.
    cleanup();
  });
});
```

### Advantages

- Simple to set up - just register a global `beforeEach` hook
- Works with all tests without modifying individual test files
- Captures the exact state when the test fails

### Disadvantages

- Requires modifying your existing cleanup strategy

## Approach 2: Extending the Test API with Custom Fixtures

Vitest allows you to extend the test API with custom fixtures. This approach lets you add automatic debugging without modifying your cleanup strategy.

### Step 1: Create a Custom Test Fixture

Create or modify your test utilities file to extend the test API:

```ts
// utils/vitest-utils.ts
import { test as baseTest } from 'vitest';
import { debug } from 'vitest-preview';

// You can re-export all exports from vitest
export * from 'vitest';

// Extend the test API with automatic debugging
const test = baseTest.extend({
  automaticDebugOnFail: [
    async ({ task }, use) => {
      await use(undefined);
      if (task.result?.state === 'fail') {
        debug();
      }
    },
    { auto: true }, // Make this fixture run automatically
  ],
});

const it = test;
export { test, it };
```

### Step 2: Use the Extended Test API

In your test files, import and use the extended test API instead of the one from Vitest:

```ts
// Example.test.tsx
// IMPORT THE EXTENDED TEST API INSTEAD OF THE ONE FROM VITEST
import { test, describe, expect } from './utils/vitest-utils';
import { render, screen, userEvent } from '@testing-library/react';

// `debug()` will be called automatically if the test fails
test('should increment count on click', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button'));

  expect(await screen.findByText(/count is: 1/i)).toBeInTheDocument();
});
```

### Advantages

- No need to modify your existing cleanup strategy
- Clean separation of concerns
- Can be selectively applied to specific test files

### Disadvantages

- Requires importing the extended test API in each test file
- Cannot use the standard `test`/`it` imports from Vitest directly

## Choosing the Right Approach

Both approaches have their merits:

- **Approach 1 (onTestFinished)** is simpler to set up globally and doesn't require changes to individual test files. This is recommended if you want to enable automatic debugging for all tests with minimal changes.

- **Approach 2 (Custom Fixtures)** gives you more flexibility and doesn't interfere with your existing cleanup strategy. This is better if you want more control over which tests use automatic debugging.

## Example Implementation

Here's a complete example of implementing automatic debugging with the first approach:

```js
// setup.ts
import { beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { debug } from 'vitest-preview';

// Disable automatic cleanup
// Instead of using afterEach(cleanup)

beforeEach((ctx) => {
  // Register a callback to run when the test finishes
  ctx.onTestFinished(({ task }) => {
    // Check if the test failed
    if (task?.result?.state === 'fail') {
      // Capture the DOM state for debugging
      debug();
    }
    // Then perform cleanup
    cleanup();
  });
});
```

## Tips for Effective Automatic Debugging

- **Combine with Manual Debugging**: You can still use manual `debug()` calls alongside automatic debugging for specific test cases.

- **CI Integration**: Automatic debugging could be useful in CI environments where tests might fail unexpectedly. However, you probably don't want to debug in CI. You can add a condition to disable automatic debugging in CI.

```js
beforeEach((ctx) => {
  ctx.onTestFinished(({ task }) => {
    if (task?.result?.state === 'fail' && !process.env.CI) {
      debug();
    }
    cleanup();
  });
});
```

- **Selective Application**: You can make automatic debugging more selective by adding conditions based on test names or other criteria.

```js
beforeEach((ctx) => {
  ctx.onTestFinished(({ task }) => {
    // Only debug specific components or test suites
    if (task?.result?.state === 'fail' && task.name.includes('Button')) {
      debug();
    }
    cleanup();
  });
});
```

## Why Not Provide a Configuration Option?

You might wonder why Vitest Preview doesn't offer a simple configuration option to enable automatic debugging. There are a few challenges:

1. **Project-Specific Cleanup Behavior**: Different projects have different cleanup strategies, making it difficult to provide a one-size-fits-all solution that works across all setups.

2. **Test API Limitations**: The `test` API imported from `vitest` is immutable, which means we can't easily extend it globally without requiring changes to import statements.

These challenges led us to provide documentation for multiple approaches, allowing users to choose the one that best fits their project structure and preferences.
