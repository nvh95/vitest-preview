import '@testing-library/jest-dom/vitest';

import '../app.css';

// Simulate the structure of `index.html`
const div = document.createElement('div');
div.id = 'app';
document.body.appendChild(div);
