# Svelte Testing Library

## Instruction

- Install the dependencies:

```bash
pnpm install
```

- Open **Vitest Preview Dashboard**:

```bash
pnpm vitest-preview
```

- Run tests:

```bash
pnpm test
```

- Modify [App.spec.ts](./App.spec.ts) to see the changes reflects in **Vitest Preview Dashboard** immediately.

## Why does the preview UI does not look the same as the real app UI?

If the preview UI is different from the real app UI, there are 2 possible reasons:

1. You haven't import global CSS files yet. Refer to <https://www.vitest-preview.com/guide/getting-started#process-css>

```js
// test/setup.ts
import '../app.css';
```

2. The HTML structure in tests is different. This is a suggestion modifying the HTML structure in tests to match the real UI:

```js
// test/setup.ts
// Simulate the structure of `index.html`
const div = document.createElement('div');
div.id = 'app';
document.body.appendChild(div);
```

```js
// Test file
describe('Counter Component', () => {
  it('it changes count when button is clicked', async () => {
    render(App, {}, { container: document.querySelector('#app') });
  });
});
```

Reference: <https://testing-library.com/docs/svelte-testing-library/api#render-options>
