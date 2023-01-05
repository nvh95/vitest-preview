# 起步

这一部分将指导你用 `vitest-preview` 来实现可视化调试. 如果你不想安装，你也可以通过 [StackBlitz](https://stackblitz.com/edit/vitest-preview?file=src%2FApp.test.tsx,README.md) 来体验.

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
# 或者
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

如果要引入全局 CSS 文件， 请放入`setupFiles`中:

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

### 添加脚本

`vitest-preview` 拥有一个命令行工具来启动 **Vitest Preview 面板**。 你可以在面板中调试你的 UI。 方便起见，你可以在`package.json`添加一行命令：

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

然后，执行你插入了 `debug()` 的测试。 测试的 UI 将在 <a href="http://localhost:5006" target="_blank" rel="noreferrer">localhost:5006</a> 打开。
