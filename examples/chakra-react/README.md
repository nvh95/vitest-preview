# Chakra UI + Vitest Preview Example

This example demonstrates how to use Vitest Preview with Chakra UI styled components.

## Features

- React application with Chakra UI for styling
- Counter component with increment functionality
- Tests using React Testing Library and Vitest
- Visual debugging with Vitest Preview

## Getting Started

### Installation

```bash
pnpm install
```

### Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui

# Run vitest-preview
pnpm vitest-preview
```

## Example Test

The example test demonstrates:

1. Rendering a Chakra UI styled component
2. Clicking a button multiple times
3. Using `debug()` from vitest-preview to visualize the component state
4. Asserting that the counter value has been updated

```tsx
import { describe, expect, it } from 'vitest';
import App from './App';
import { render, screen, userEvent } from './utils/test-utils';
import { debug } from 'vitest-preview';

describe('Chakra UI App component test', () => {
  it('should increment count on click', async () => {
    render(<App />);
    
    // Find the button by its role and text content
    const button = screen.getByRole('button', { name: /count is: 0/i });
    
    // Click the button multiple times
    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);
    
    // Debug the current state for vitest-preview
    debug();
    
    // Assert that the count has been updated
    expect(await screen.findByText(/count is: 3/i)).toBeInTheDocument();
  });
});
```

## Key Files

- `src/App.tsx` - Main application component with Chakra UI styling
- `src/hooks/useCounter.ts` - Custom hook for counter functionality
- `src/utils/test-utils.tsx` - Testing utilities with Chakra UI provider
- `src/App.test.tsx` - Test file demonstrating vitest-preview usage
