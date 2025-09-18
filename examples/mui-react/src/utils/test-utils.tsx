/* eslint-disable import/export */
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { cleanup, render } from '@testing-library/react';
import { ReactElement } from 'react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

// Create a theme instance for testing
const theme = createTheme({
  // Optional: customize theme for testing if needed
});

const customRender = (ui: ReactElement, options = {}) =>
  render(ui, {
    // Wrap with ThemeProvider to provide MUI theme context
    wrapper: ({ children }) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    ),
    ...options,
  });

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
// override render export
export { customRender as render };
