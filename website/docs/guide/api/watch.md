# watch

The `watch` function automatically captures DOM changes and triggers the `debug()` function, allowing you to preview your UI as it changes without manually calling `debug()`.

## Usage

```js
import { watch } from 'vitest-preview';

let stopWatching;
// Start watching for DOM changes
beforeEach(() => {
  stopWatching = watch();
});

// Stop watching when done
afterEach(() => {
  stopWatching();
});

// ... your test code ...
```

## API

```ts
function watch(options?: {
  throttle?: number | null;
  start?: boolean;
  end?: boolean;
  debug?: boolean;
}): () => void;
```

### Parameters

- `options` (optional): Configuration options for the watch function
  - `throttle` (optional): Time in milliseconds to throttle debug calls (default: 50). Set to `null` to disable throttling.
  - `start` (optional): Whether to call debug immediately when watch is started (default: true)
  - `end` (optional): Whether to call debug one final time before stopping watching (default: true)
  - `debug` (optional): Whether to log the total number of debug calls to the console (default: false)

### Returns

- A function to stop watching for DOM changes

## Example

```js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { watch } from 'vitest-preview';
import Counter from './Counter';

let stopWatching;
beforeEach(() => {
  stopWatching = watch({
    throttle: 50, // Throttle debug calls every 50ms
  });
});

afterEach(() => {
  stopWatching();
});

test('increments counter', async () => {
  render(<Counter />);
  // Initial render is automatically captured

  await userEvent.click(screen.getByText('Increment'));
  // Updated DOM after click is automatically captured

  await userEvent.click(screen.getByText('Increment'));
  // Updated DOM after second click is automatically captured
});
```

## When to use

Use `watch` when:

1. You want to see how your UI changes through multiple interactions
2. You don't want to manually add `debug()` calls throughout your test
3. You're debugging a complex test with many DOM updates

## Caveats

Since Vitest runs so fast, the DOM changes may be too fast for the browser to keep up with.

The author has done a test with 10000 DOM updates and Vitest Preview can capture 6 DOM changes on Vitest Preview Dashboard.

If you have problem with performance, you can use `throttle` option to throttle the debug calls.
