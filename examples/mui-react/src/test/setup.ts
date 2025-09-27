import '@testing-library/jest-dom/vitest';

// Import global css to use with vitest-preview
import '../index.css';
import { sheet } from '@emotion/css';

sheet.speedy(true);
