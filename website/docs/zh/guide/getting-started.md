# Getting Started

这一部分将全程指导你用 `vitest-preview` 来实现可视化调试. 你也可以通过 [StackBlitz](https://stackblitz.com/edit/vitest-preview?file=src%2FApp.test.tsx,README.md) 来体验而无需安装.

[![Try Vitest Preview now](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/vitest-preview?file=src%2FApp.test.tsx,README.md)

<p align="center">
  <img align="center" src="https://user-images.githubusercontent.com/8603085/197373376-f6a3fe33-487b-4c35-8085-8e7e6357ce40.gif" alt="Vitest Preview Demo" />
</p>

::: warning
If you are using Jest, you can try [jest-preview](https://github.com/nvh95/jest-preview) with a similar functionality.
:::

## Step 1: Installation

```bash
npm install --save-dev vitest-preview
# Or
yarn add -D vitest-preview
pnpm add -D vitest-preview
```

## Step 2: Configuration

### Process CSS

You need to configure `vitest` to process CSS by:

```diff
// vite.config.js
export default defineConfig({
  test: {
+    css: true,
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

### Update .gitignore

Update your `.gitignore`

```
// .gitignore
.vitest-preview
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

```bash
npm run vitest-preview
# Or
yarn vitest-preview
pnpm vitest-preview
```

Then execute your tests that contain `debug()`. You will see the UI of your tests at localhost:5006.
