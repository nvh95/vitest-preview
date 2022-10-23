import { describe, expect, it } from 'vitest';
import App from './App';
import { render, screen, userEvent } from './utils/test-utils';
import { debug } from 'vitest-preview';

describe('Simple working test', () => {
  it('should increment count on click', async () => {
    render(<App />);
    userEvent.click(screen.getByRole('button'));
    userEvent.click(screen.getByRole('button'));
    userEvent.click(screen.getByRole('button'));
    debug();
    expect(await screen.findByText(/count is: 3/i)).toBeInTheDocument();
  });
});
