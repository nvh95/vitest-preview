# Getting Started

This section will guide you through the process of using for visual testing experience with `vitest-preview`. You can try it without installing anything at [StackBlitz](https://stackblitz.com/edit/vitest-preview?file=src%2FApp.test.tsx,README.md).

[![Try Vitest Preview now](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/vitest-preview?file=src%2FApp.test.tsx,README.md)

<p align="center">
  <img align="center" src="https://user-images.githubusercontent.com/8603085/197373376-f6a3fe33-487b-4c35-8085-8e7e6357ce40.gif" alt="Vitest Preview Demo" />
</p>

::: warning
If you are using Jest, you can try [jest-preview](https://github.com/nvh95/jest-preview) with a similar functionality.
:::

## Step 1: Installation

::: code-group

```bash [npm]
npm install --save-dev vitest-preview
```

```bash [Yarn]
yarn add -D vitest-preview
```

```bash [pnpm]
pnpm add -D vitest-preview
```

:::

## Step 2: Configuration

### Process CSS

You need to configure `vitest` to process CSS by:

```diff
// vite.config.js
export default defineConfig({
  test: {
+    css: !process.env.CI, // We usually don't want to process CSS in CI
  },
});

```

You might want to import your CSS global files in `setupFiles`:

```diff
// vite.config.js
export default defineConfig({
  test: {
+    setupFiles: './src/test/setup.ts',
  },
});

```

```ts
// src/test/setup.ts
import './global.css';
import '@your-design-system/css/dist/index.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
```

### Add script vitest-preview

`vitest-preview` has a CLI that opens **Vitest Preview Dashboard** where you can preview your tests' UI. You can update your `package.json` to add a script for more convenience:

```json
"scripts": {
  "vitest-preview": "vitest-preview"
},
```

## Step 3: Usage

Put `debug()` wherever you want to see the UI in your tests.

```diff
+import { debug } from 'vitest-preview';

describe('App', () => {
  it('should work as expected', () => {
    render(<App />);
+    debug();
  });
});
```

Open the **Vitest Preview Dashboard** by running the CLI command (updated in [Configuration](#step-2-configuration)):

::: code-group

```bash [npm]
npm run vitest-preview
```

```bash [Yarn]
yarn vitest-preview
```

```bash [pnpm]
pnpm vitest-preview
```

:::

Then execute your tests that contain `debug()`. You will see the UI of your tests at http://localhost:5006.

## (Optional) Step 4: Automatic Mode

You can use automatic mode to automatically preview the UI without manually calling `debug()` in each test.

Read more at [What is Automatic Mode?](/guide/what-is-automatic-mode).
