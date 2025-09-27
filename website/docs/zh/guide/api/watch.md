# watch

`watch` 函数自动捕获 DOM 变化并触发 `debug()` 函数，让您无需手动调用 `debug()` 即可预览 UI 的变化。

## 用法

```js
import { watch } from 'vitest-preview';

let stopWatching;
// 开始监视 DOM 变化
beforeEach(() => {
  stopWatching = watch({ throttle: 200 });
});

// 完成后停止监视
afterEach(() => {
  stopWatching();
});

// ... 您的测试代码 ...
```

## API

```ts
function watch(options?: { throttle?: number }): () => void;
```

### 参数

- `options` (可选): watch 函数的配置选项
  - `throttle` (可选): 节流 debug 调用的时间（毫秒），默认值: 100

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
  stopWatching = watch();
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

## 性能考虑

由于 `watch` 使用 MutationObserver 监视 DOM 变化，如果与非常频繁的 DOM 更新一起使用，可能会影响性能。`throttle` 选项通过限制调用 `debug()` 的频率来缓解这个问题。

对于具有极其频繁 DOM 更新的测试，考虑在特定点使用手动 `debug()` 调用。
