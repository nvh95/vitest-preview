# watch

The `watch` function automatically captures DOM changes and triggers the `debug()` function, allowing you to preview your UI as it changes without manually calling `debug()`.

## Usage

```js
import { watch } from 'vitest-preview';

let stopWatching;
// Start watching for DOM changes
beforeEach(() => {
  stopWatching = watch({ throttle: 200 });
});

// Stop watching when done
afterEach(() => {
  stopWatching();
});

// ... your test code ...
```

## API

```ts
function watch(options?: { throttle?: number }): () => void;
```

### Parameters

- `options` (optional): Configuration options for the watch function
  - `throttle` (optional): Time in milliseconds to throttle debug calls (default: 100)

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
  stopWatching = watch();
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

## Performance considerations

Since `watch` uses a MutationObserver to monitor DOM changes, it may impact performance if used with very frequent DOM updates. The `throttle` option helps mitigate this by limiting how often `debug()` is called.

For tests with extremely frequent DOM updates, consider using manual `debug()` calls at specific points instead.
