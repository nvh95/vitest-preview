/* eslint-disable import/export */
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { cleanup, render } from '@testing-library/react';
import { ReactElement } from 'react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

const customRender = (ui: ReactElement, options = {}) =>
  render(ui, {
    // Wrap with ChakraProvider to provide theme context
    wrapper: ({ children }) => (
      <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
    ),
    ...options,
  });

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
// override render export
export { customRender as render };
