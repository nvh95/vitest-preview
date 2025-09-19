import '@testing-library/jest-dom';

// Import global css to use with vitest-preview
import '../index.css';
import { sheet } from '@emotion/css';

sheet.speedy(true);
