# Auto Preview on DOM Changes

While the `debug()` function is useful for capturing the DOM state at specific points in your test, sometimes you want to continuously monitor and preview the DOM as it changes during test execution. This is where the `autoPreviewOnDomChanges` function comes in.

## What is Auto Preview on DOM Changes?

`autoPreviewOnDomChanges` is a feature that automatically captures and previews the DOM state whenever changes occur in the document. It uses a MutationObserver to detect DOM mutations and calls `debug()` automatically when changes are detected.

This is particularly useful for:

- Observing UI transitions and state changes in real-time
- Debugging complex interactions with multiple DOM updates
- Visual testing of animations or dynamic content

## Basic Usage

The simplest way to use Auto Preview on DOM Changes is to call `autoPreviewOnDomChanges()` in your test setup file:

```js
// src/test/setup.ts or your test setup file
import { autoPreviewOnDomChanges } from 'vitest-preview';

// Enable automatic preview on DOM changes for all tests
autoPreviewOnDomChanges();
```

This will automatically:

1. Start watching for DOM changes at the beginning of each test
2. Capture and preview the DOM state whenever changes occur
3. Stop watching at the end of each test

## Configuration Options

You can customize the behavior of `autoPreviewOnDomChanges` by passing an options object:

```js
import { autoPreviewOnDomChanges } from 'vitest-preview';

autoPreviewOnDomChanges({
  // Time in milliseconds to throttle debug calls (default: 50)
  // Set to null to disable throttling
  throttle: 100,

  // Whether to call debug immediately when watch is started (default: true)
  start: true,

  // Whether to call debug one final time before stopping watching (default: true)
  end: true,

  // Whether to see debug logs (default: false)
  debug: false,
});
```

### Options Explained

- **throttle**: Controls how frequently `debug()` is called when DOM changes are detected.

- **start**: When `true`, captures the initial DOM state at the beginning of each test.

- **end**: When `true`, captures the final DOM state at the end of each test.

- **debug**: When `true`, logs the total number of `debug()` calls to the console, which can be useful for performance monitoring.

## Using the Underlying `watch` Function

If you need more control over when to start and stop watching for DOM changes, you can use the underlying `watch` function directly:

```js
import { watch } from 'vitest-preview';

test('should update UI on button click', async () => {
  render(<MyComponent />);

  // Start watching for DOM changes
  const stopWatching = watch({ throttle: 100 });

  // Perform actions that cause DOM changes
  await userEvent.click(screen.getByRole('button'));

  // Stop watching when done
  stopWatching();
});
```

The `watch` function returns a function that you can call to stop watching for DOM changes.

## Example: Debugging a Counter

Here's an example of using Auto Preview on DOM Changes to debug a counter:

```js
import { render, screen, userEvent } from '@testing-library/react';
import { test, expect } from 'vitest';
import { watch } from 'vitest-preview';
import { Counter } from './Counter';

test('should show counter value', async () => {
  render(<Counter />);

  // Start watching for DOM changes
  const stopWatching = watch();

  for (let i = 0; i < 10000; i++) {
    await userEvent.click(screen.getByRole('button', { name: /increase/i }));
  }

  // Verify success message appears
  expect(screen.getByText(/count/i)).toBe(10001);

  // Stop watching
  stopWatching();
});
```

In this example, the Vitest Preview Dashboard will show the DOM state after each interaction, making it easy to see how the counter evolves during the test.
