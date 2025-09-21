# debug

The `debug` function is the core API of Vitest Preview. It captures the current state of the DOM and makes it available for preview in the browser.

## Usage

```ts
import { debug } from 'vitest-preview';

test('renders correctly', () => {
  render(<YourComponent />);

  // Call debug to capture the current DOM state
  debug();
});
```

This captured HTML can then be viewed in the browser through the Vitest Preview server, allowing you to visually inspect the rendered component.

## Notes

- Call `debug()` at the point in your test where you want to capture the DOM state
- You can call `debug()` multiple times in a test to capture different states
- The preview will show the most recent debug call's output
