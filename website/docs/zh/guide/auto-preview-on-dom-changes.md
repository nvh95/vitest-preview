# DOM 变化时自动预览

虽然 `debug()` 函数对于在测试的特定点捕获 DOM 状态很有用，但有时您希望在测试执行期间持续监控和预览 DOM 的变化。这就是 `autoPreviewOnDomChanges` 函数的用途。

## 什么是 DOM 变化时自动预览？

`autoPreviewOnDomChanges` 是一项功能，当文档中发生变化时，它会自动捕获和预览 DOM 状态。它使用 MutationObserver 检测 DOM 变化，并在检测到变化时自动调用 `debug()`。

这特别适用于：

- 实时观察 UI 过渡和状态变化
- 调试具有多个 DOM 更新的复杂交互
- 对动画或动态内容进行视觉测试

## 基本用法

使用 DOM 变化时自动预览的最简单方法是在测试设置文件中调用 `autoPreviewOnDomChanges()`：

```js
// src/test/setup.ts 或您的测试设置文件
import { autoPreviewOnDomChanges } from 'vitest-preview';

// 为所有测试启用 DOM 变化时自动预览
autoPreviewOnDomChanges();
```

这将自动：

1. 在每个测试开始时开始监视 DOM 变化
2. 在发生变化时捕获和预览 DOM 状态
3. 在每个测试结束时停止监视

## 配置选项

您可以通过传递选项对象来自定义 `autoPreviewOnDomChanges` 的行为：

```js
import { autoPreviewOnDomChanges } from 'vitest-preview';

autoPreviewOnDomChanges({
  // 节流 debug 调用的时间（毫秒）（默认：50）
  // 设置为 null 禁用节流
  throttle: 100,
  
  // 是否在开始监视时立即调用 debug（默认：true）
  start: true,
  
  // 是否在停止监视前最后调用一次 debug（默认：true）
  end: true,
  
  // 是否将 debug 调用总数记录到控制台（默认：false）
  debug: false,
});
```

### 选项说明

- **throttle**：控制在检测到 DOM 变化时调用 `debug()` 的频率。较高的值会减少捕获次数，但可能会错过一些中间状态。

- **start**：当为 `true` 时，在每个测试开始时捕获初始 DOM 状态。

- **end**：当为 `true` 时，在每个测试结束时捕获最终 DOM 状态。

- **debug**：当为 `true` 时，将 `debug()` 调用的总数记录到控制台，这对性能监控很有用。

## 直接使用底层 `watch` 函数

如果您需要更好地控制何时开始和停止监视 DOM 变化，可以直接使用底层的 `watch` 函数：

```js
import { watch } from 'vitest-preview';

test('should update UI on button click', async () => {
  render(<MyComponent />);
  
  // 开始监视 DOM 变化
  const stopWatching = watch({ throttle: 100 });
  
  // 执行导致 DOM 变化的操作
  await userEvent.click(screen.getByRole('button'));
  
  // 完成后停止监视
  stopWatching();
});
```

`watch` 函数返回一个函数，您可以调用该函数来停止监视 DOM 变化。

## 与测试失败时自动预览结合使用

您可以将 DOM 变化时自动预览与测试失败时自动预览结合使用，以进行全面调试：

```js
// src/test/setup.ts
import { beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { debug, autoPreviewOnDomChanges } from 'vitest-preview';

// 使用自定义选项启用 DOM 变化时自动预览
autoPreviewOnDomChanges({ throttle: 200 });

// 同时启用测试失败时自动预览
beforeEach((ctx) => {
  ctx.onTestFinished(({ task }) => {
    if (task?.result?.state === 'fail') {
      debug();
    }
    cleanup();
  });
});
```

## 性能考虑

虽然 DOM 变化时自动预览是一个强大的调试工具，但它可能会生成大量捕获，特别是对于具有许多 DOM 更新的测试。考虑以下提示以获得最佳性能：

- 使用较高的 `throttle` 值（例如，100-200ms）来减少捕获频率
- 仅为需要这种级别调试的特定测试启用它
- 在不需要视觉调试的 CI 环境中禁用它

```js
// 仅在开发环境中启用，而不是在 CI 中
if (!process.env.CI) {
  autoPreviewOnDomChanges();
}
```

## 示例：调试表单提交

以下是使用 DOM 变化时自动预览调试表单提交的示例：

```js
import { render, screen, userEvent } from '@testing-library/react';
import { test, expect } from 'vitest';
import { watch } from 'vitest-preview';
import { SignupForm } from './SignupForm';

test('should show success message on form submission', async () => {
  render(<SignupForm />);
  
  // 开始监视 DOM 变化
  const stopWatching = watch();
  
  // 填写表单
  await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
  await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'securepass123');
  
  // 提交表单
  await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
  
  // 验证成功消息出现
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
  
  // 停止监视
  stopWatching();
});
```

在此示例中，Vitest Preview 仪表板将在每次交互后显示 DOM 状态，使您可以轻松查看表单在测试期间的演变。
