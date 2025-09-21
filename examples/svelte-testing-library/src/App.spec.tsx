import { describe, expect, it } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { debug } from 'vitest-preview';
import App from './App.svelte';

describe('Counter Component', () => {
  it('it changes count when button is clicked', async () => {
    render(
      App,
      {},
      {
        // Mimic the real DOM
        // See 'src/test/setup.ts' for more details.
        baseElement: document.querySelector('#app') as HTMLElement,
      },
    );
    debug();
    const button = screen.getByRole('button');
    expect(button.innerHTML).toBe('count is 0');
    await fireEvent.click(button);
    await fireEvent.click(button);
    await fireEvent.click(button);
    await fireEvent.click(button);

    expect(button.innerHTML).toBe('count is 4');
  });
  it('sdsfd', () => {
    render(App);
  });
});
