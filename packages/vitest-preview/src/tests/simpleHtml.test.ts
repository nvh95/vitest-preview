import { describe, it, expect } from 'vitest';
import { debug } from '../preview';

describe('simple html', () => {
  it('should show simple html', () => {
    document.body.innerHTML = '<h1>Hello World</h1>';
    debug()
    expect(document.body.innerHTML).toBe('<h1>Hello World</h1>');
  });
});
