# configure

The `configure` function allows you to customize the behavior of Vitest Preview by providing configuration options.

## Usage

```ts
// setup.ts or setup.js
import { configure } from 'vitest-preview';

configure({
  externalCss: [
    './styles/global.css',
    './public/index.css',
    './node_modules/@your-ui-lib/dist/styles.css',
  ],
});
```

## Options

### `externalCss`

An array of strings representing paths to CSS files that should be included in the preview. These paths should be relative to your current working directory, not your test setup file.

```ts
configure({
  externalCss: [
    './styles/global.css',
    './public/index.css',
    './node_modules/@your-ui-lib/dist/styles.css',
  ],
});
```

## Notes

- You typically want to call `configure` once in your test setup file
- Make sure paths in `externalCss` are relative to your current working directory (usually the project root)
- Vitest Preview Dashboard will not refresh automatically if `externalCss` files are changed. You need manually refresh the dashboard to see the changes.
- It is encounraged to configure external CSS by importing them directly in your test setup file instead. By doing that, your CSS files will be processed by Vite and included in the preview.

```ts
// setup.ts or setup.js
import { configure } from 'vitest-preview';

// Should import CSS files directly in your test setup file
import './styles/global.css';
import './public/index.css';
import './node_modules/@your-ui-lib/dist/styles.css';
```
