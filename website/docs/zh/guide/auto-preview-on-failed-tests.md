# 测试失败时自动预览

虽然在测试中手动调用 `debug()` 可以精确控制何时捕获 DOM 状态，但有时您希望在测试失败时自动捕获 UI 状态。这对于调试 CI 环境中的测试失败或运行大型测试套件特别有用。

本指南展示了两种设置**测试失败时自动预览**的方法，无需在每个测试中手动调用 `debug()`。

## 使用 CLI 配置测试失败时自动预览

您可以运行以下命令，轻松设置**测试失败时自动预览**：

```bash
vitest-preview setup --automaticMode
```

但是，请务必仔细阅读本指南，确保针对您的特定设置正确配置测试失败时自动预览。

## 方法 1：使用 `onTestFinished` 钩子（推荐）

Vitest 提供了强大的测试上下文 API，允许您挂钩到测试生命周期。您可以使用 `onTestFinished` 钩子在测试失败时自动调用 `debug()`。

### 步骤 1：禁用自动清理

如果您使用的是 Testing Library，首先需要禁用[自动清理](https://testing-library.com/docs/react-testing-library/setup/#auto-cleanup-in-vitest)。否则，在您使用 `debug()` 捕获之前，DOM 将被清理。

```diff
// vitest.config.ts/ vite.config.ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vitest';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
-    globals: true,
  },
});
```

同时，确保您的测试设置文件不执行自动清理

```diff
// setupFiles.ts
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
-  cleanup()
})
```

### 步骤 2：添加 `onTestFinished` 钩子

将以下代码添加到您的测试设置文件（例如，`src/test/setup.ts` 或 Vitest 配置中 `setupFiles` 指定的文件）：

```js
// setupFiles.ts
import { beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { debug } from 'vitest-preview';

beforeEach((ctx) => {
  ctx.onTestFinished(({ task }) => {
    if (task?.result?.state === 'fail') {
      // 在 Vitest Preview 仪表板中预览失败的测试
      debug();
    }
    // 仍然执行清理，但在捕获 DOM 状态之后。这取决于您使用的清理策略。
    cleanup();
  });
});
```

### 优点

- 设置简单 - 只需注册一个全局 `beforeEach` 钩子
- 无需修改单个测试文件即可适用于所有测试
- 在测试失败时捕获确切状态

### 缺点

- 需要修改现有的清理策略

## 方法 2：使用自定义 Fixtures 扩展测试 API

Vitest 允许您使用自定义 fixtures 扩展测试 API。这种方法可以在不修改清理策略的情况下添加自动调试。

### 步骤 1：创建自定义测试 Fixture

创建或修改您的测试工具文件以扩展测试 API：

```ts
// utils/vitest-utils.ts
import { test as baseTest } from 'vitest';
import { debug } from 'vitest-preview';

// 您可以重新导出 vitest 的所有导出
export * from 'vitest';

// 使用自动调试扩展测试 API
const test = baseTest.extend({
  automaticDebugOnFail: [
    async ({ task }, use) => {
      await use(undefined);
      if (task.result?.state === 'fail') {
        debug();
      }
    },
    { auto: true }, // 使此 fixture 自动运行
  ],
});

const it = test;
export { test, it };
```

### 步骤 2：使用扩展的测试 API

在您的测试文件中，导入并使用扩展的测试 API，而不是来自 Vitest 的测试 API：

```ts
// Example.test.tsx
// 导入扩展的测试 API 而不是来自 VITEST 的测试 API
import { test, describe, expect } from './utils/vitest-utils';
import { render, screen, userEvent } from '@testing-library/react';

// 如果测试失败，`debug()` 将自动调用
test('should increment count on click', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button'));

  expect(await screen.findByText(/count is: 1/i)).toBeInTheDocument();
});
```

### 优点

- 无需修改现有的清理策略
- 关注点分离清晰
- 可以选择性地应用于特定测试文件

### 缺点

- 需要在每个测试文件中导入扩展的测试 API
- 不能直接使用来自 Vitest 的标准 `test`/`it` 导入

## 选择合适的方法

两种方法各有优点：

- **方法 1 (onTestFinished)** 设置更简单，全局生效，不需要更改单个测试文件。如果您希望以最少的更改为所有测试启用自动调试，推荐使用此方法。

- **方法 2 (自定义 Fixtures)** 提供更多灵活性，不会干扰现有的清理策略。如果您希望更好地控制哪些测试使用自动调试，这种方法更好。

## 示例实现

这是使用第一种方法实现自动调试的完整示例：

```js
// setup.ts
import { beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { debug } from 'vitest-preview';

// 禁用自动清理
// 而不是使用 afterEach(cleanup)

beforeEach((ctx) => {
  // 注册一个在测试完成时运行的回调
  ctx.onTestFinished(({ task }) => {
    // 检查测试是否失败
    if (task?.result?.state === 'fail') {
      // 捕获用于调试的 DOM 状态
      debug();
    }
    // 然后执行清理
    cleanup();
  });
});
```

## 有效自动调试的提示

- **结合手动调试**：您仍然可以将手动 `debug()` 调用与自动调试一起使用，用于特定的测试用例。

- **CI 集成**：自动调试在 CI 环境中可能很有用，因为测试可能会意外失败。但是，您可能不希望在 CI 中进行调试。您可以添加条件以在 CI 中禁用自动调试。

```js
beforeEach((ctx) => {
  ctx.onTestFinished(({ task }) => {
    if (task?.result?.state === 'fail' && !process.env.CI) {
      debug();
    }
    cleanup();
  });
});
```

- **选择性应用**：您可以根据测试名称或其他条件使自动调试更具选择性。

```js
beforeEach((ctx) => {
  ctx.onTestFinished(({ task }) => {
    // 只调试特定组件或测试套件
    if (task?.result?.state === 'fail' && task.name.includes('Button')) {
      debug();
    }
    cleanup();
  });
});
```

## 为什么不提供配置选项？

您可能想知道为什么 Vitest Preview 不提供简单的配置选项来启用自动调试。有几个挑战：

1. **项目特定的清理行为**：不同的项目有不同的清理策略，这使得很难提供适用于所有设置的一刀切解决方案。

2. **测试 API 限制**：从 `vitest` 导入的 `test` API 是不可变的，这意味着我们不能轻易地全局扩展它，而不需要更改导入语句。

这些挑战导致我们提供多种方法的文档，允许用户选择最适合其项目结构和偏好的方法。
