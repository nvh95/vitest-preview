# 起步

这一部分将指导你用 `vitest-preview` 来实现可视化调试. 你也可以通过 [StackBlitz](https://stackblitz.com/edit/vitest-preview?file=src%2FApp.test.tsx,README.md) 来体验而无需安装.

[![Try Vitest Preview now](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/vitest-preview?file=src%2FApp.test.tsx,README.md)

<p align="center">
  <img align="center" src="https://user-images.githubusercontent.com/8603085/197373376-f6a3fe33-487b-4c35-8085-8e7e6357ce40.gif" alt="Vitest Preview Demo" />
</p>

::: warning
如果你在使用 Jest, 不妨试试类似的 [jest-preview](https://github.com/nvh95/jest-preview) .
:::

## Step 1: 安装

```bash
npm install --save-dev vitest-preview
# Or
yarn add -D vitest-preview
pnpm add -D vitest-preview
```

## Step 2: 配置

### 处理 CSS

你需要在 `vitest` 中启用处理 CSS:

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

### 更新 .gitignore

更新`.gitignore`

```
// .gitignore
.vitest-preview
```

## Step 3: 使用

在你想在测试中使用UI的位置，执行 `debug()` 方法。

```diff
+import { debug } from 'vitest-preview';

describe('App', () => {
  it('should work as expected', () => {
    render(<App />);
+    debug();
  });
});
```

执行以下命令来打开 **Vitest Preview 面板** (你可以在 [配置](#step-2-configuration) 中自定义命令):

```bash
npm run vitest-preview
# 或者
yarn vitest-preview
pnpm vitest-preview
```

Then execute your tests that contain `debug()`. You will see the UI of your tests at localhost:5006.
