# MUI + Vitest Preview Example

This example demonstrates how to use Vitest Preview with Material UI (MUI) v7 styled components.

## Features

- React application with MUI v7.3.2 for styling
- Counter component with increment functionality
- Tests using React Testing Library and Vitest
- Visual debugging with Vitest Preview
- Custom styled components using MUI's styled API

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

1. Rendering a MUI styled component
2. Clicking a button multiple times
3. Using `debug()` from vitest-preview to visualize the component state
4. Asserting that the counter value has been updated

```tsx
import { describe, expect, it } from 'vitest';
import App from './App';
import { render, screen, userEvent } from './utils/test-utils';
import { debug } from 'vitest-preview';

describe('MUI App component test', () => {
  it('should increment count on click', async () => {
    render(<App />);
    
    // Find the button using MUI's Button component
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

## MUI Integration

This example showcases several MUI features:

1. **Theme Provider**: Both the app and tests use MUI's ThemeProvider
2. **Styled Components**: Custom styled components using MUI's styled API
3. **MUI Components**: Various components like Button, Card, Typography, etc.
4. **Responsive Layout**: Using Grid and Container components

## Key Files

- `src/App.tsx` - Main application component with MUI styling
- `src/hooks/useCounter.ts` - Custom hook for counter functionality
- `src/utils/test-utils.tsx` - Testing utilities with MUI ThemeProvider
- `src/App.test.tsx` - Test file demonstrating vitest-preview usage
- `src/main.tsx` - Entry point with MUI ThemeProvider setup

## Notes

- This example uses MUI v7.3.2, the latest version as of September 2025
- The test setup includes proper ThemeProvider wrapping to ensure components render correctly in tests
- Custom styled components demonstrate MUI's styling capabilities
