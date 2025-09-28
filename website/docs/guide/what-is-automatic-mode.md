# What is Automatic Mode?

Automatic Mode in Vitest Preview refers to features that automatically capture and preview the DOM state without requiring manual `debug()` calls in your tests. This can significantly improve your testing workflow by providing visual feedback at critical moments.

## Two Types of Automatic Mode

Vitest Preview offers two different automatic preview options:

### 1. Auto Preview on Failed Tests

This mode automatically captures and previews the DOM state when a test fails. It's particularly useful for:

- Debugging test failures
- Running large test suites where manually adding `debug()` calls would be impractical
- Quickly identifying UI issues without modifying test code

[Learn more about Auto Preview on Failed Tests →](/guide/auto-preview-on-failed-tests)

### 2. Auto Preview on DOM Changes

This mode continuously monitors the DOM for changes during test execution and automatically captures the state whenever the DOM is modified. It's ideal for:

- Observing UI transitions and state changes in real-time
- Debugging complex interactions with multiple DOM updates
- Visual testing of animations or dynamic content

[Learn more about Auto Preview on DOM Changes →](/guide/auto-preview-on-dom-changes)

## Choosing the Right Automatic Mode

Both automatic modes serve different purposes:

- **Auto Preview on Failed Tests** is best for catching issues when tests fail without adding manual debug calls
- **Auto Preview on DOM Changes** is best for observing the evolution of the UI during test execution

You can use either mode independently or combine them based on your specific testing needs.

## Getting Started with Automatic Mode

To get started with automatic mode, choose the approach that best fits your needs:

For Auto Preview on Failed Tests, review [Auto Preview on Failed Tests](/guide/auto-preview-on-failed-tests) guide. This CLI might boost your initial setup:

```bash
# Set up Auto Preview on Failed Tests using the CLI
vitest-preview setup --automaticMode
```

Or add Auto Preview on DOM Changes to your tests:

```js
import { autoPreviewOnDomChanges } from 'vitest-preview';

autoPreviewOnDomChanges();
```

For more detailed instructions, see the specific guides for each automatic mode.
