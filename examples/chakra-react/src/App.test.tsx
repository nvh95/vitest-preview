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
