# configure

`configure` 函数允许你通过提供配置选项来自定义 Vitest Preview 的行为。

## 用法

```ts
// setup.ts 或 setup.js
import { configure } from 'vitest-preview';

configure({
  externalCss: [
    './styles/global.css',
    './public/index.css',
    './node_modules/@your-ui-lib/dist/styles.css',
  ],
});
```

## 选项

### `externalCss`

一个字符串数组，表示应包含在预览中的 CSS 文件的路径。这些路径应相对于你的当前工作目录，而不是你的测试设置文件。

```ts
configure({
  externalCss: [
    './styles/global.css',
    './public/index.css',
    './node_modules/@your-ui-lib/dist/styles.css',
  ],
});
```

## 注意事项

- 你通常希望在测试设置文件中调用一次 `configure`
- 确保 `externalCss` 中的路径相对于你的当前工作目录（通常是项目根目录）
- 建议直接在测试设置文件中导入外部 CSS。这样，你的 CSS 文件将由 Vite 处理并包含在预览中。

```ts
// setup.ts 或 setup.js
import { configure } from 'vitest-preview';

// 应该直接在测试设置文件中导入 CSS 文件
import './styles/global.css';
import './public/index.css';
import './node_modules/@your-ui-lib/dist/styles.css';
```
