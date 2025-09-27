# watch

`watch` 函数自动捕获 DOM 变化并触发 `debug()` 函数，让您无需手动调用 `debug()` 即可预览 UI 的变化。

## 用法

```js
import { watch } from 'vitest-preview';

let stopWatching;
// 开始监视 DOM 变化
beforeEach(() => {
  stopWatching = watch();
});

// 完成后停止监视
afterEach(() => {
  stopWatching();
});

// ... 您的测试代码 ...
```

## API

```ts
function watch(options?: {
  throttle?: number | null;
  start?: boolean;
  end?: boolean;
  debug?: boolean;
}): () => void;
```

### 参数

- `options` (可选): watch 函数的配置选项
  - `throttle` (可选): 节流 debug 调用的时间（毫秒），默认值: 50。设置为 `null` 可禁用节流。
  - `start` (可选): 是否在开始监视时立即调用 debug（默认值：true）
  - `end` (可选): 是否在停止监视前最后调用一次 debug（默认值：true）
  - `debug` (可选): 是否将 debug 调用的总次数输出到控制台（默认值：false）

### 返回值

- 一个停止监视 DOM 变化的函数

## 示例

```js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { watch } from 'vitest-preview';
import Counter from './Counter';

let stopWatching;
beforeEach(() => {
  stopWatching = watch({
    throttle: 50, // 每50毫秒节流一次debug调用
  });
});

afterEach(() => {
  stopWatching();
});

test('计数器递增', async () => {
  render(<Counter />);
  // 初始渲染会自动捕获

  await userEvent.click(screen.getByText('递增'));
  // 点击后更新的 DOM 会自动捕获

  await userEvent.click(screen.getByText('递增'));
  // 第二次点击后更新的 DOM 会自动捕获
});
```

## 何时使用

在以下情况使用 `watch`：

1. 您想查看 UI 在多次交互中的变化
2. 您不想在整个测试中手动添加 `debug()` 调用
3. 您正在调试具有多次 DOM 更新的复杂测试

## 注意事项

由于 Vitest 运行得很快，DOM 变化可能快到浏览器跟不上。

作者进行了一个测试，在 10000 次 DOM 更新中，Vitest Preview 可以在 Vitest Preview Dashboard 上捕获 6 次 DOM 变化。

如果您遇到性能问题，可以使用 `throttle` 选项来节流 debug 调用。
