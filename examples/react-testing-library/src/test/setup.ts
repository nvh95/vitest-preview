import '@testing-library/jest-dom';
import { configure } from 'vitest-preview';

// Import global css to use with vitest-preview
import '../index.css';

configure({
  externalCss: ['src/background.css'],
});
