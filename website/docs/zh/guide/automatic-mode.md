# 自动模式

::: warning 注意
此页面已移动并拆分为多个页面，以便更好地组织。
:::

Vitest Preview 现在提供两种类型的自动模式：

## 什么是自动模式？

Vitest Preview 中的自动模式是指无需在测试中手动调用 `debug()` 就能自动捕获和预览 DOM 状态的功能。

[了解更多关于自动模式 →](/zh/guide/what-is-automatic-mode)

## 测试失败时自动预览

这种模式会在测试失败时自动捕获和预览 DOM 状态。它特别适用于在不添加手动调试调用的情况下调试测试失败。

[了解更多关于测试失败时自动预览 →](/zh/guide/auto-preview-on-failed-tests)

## DOM 变化时自动预览

这种模式在测试执行期间持续监控 DOM 变化，并在 DOM 被修改时自动捕获状态。

[了解更多关于 DOM 变化时自动预览 →](/zh/guide/auto-preview-on-dom-changes)
