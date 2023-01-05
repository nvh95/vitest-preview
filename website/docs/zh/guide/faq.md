# 常见问题

## 为什么预览 UI 和实际 UI 不一样？

可能有两个原因:

1. 你没有引入全局 CSS 文件，参阅 <https://www.vitest-preview.com/guide/getting-started#process-css>

```js
// test/setup.ts
import '../global.css';
```

2. 测试中的 HTML 结构不一样。 你需要更新 `jsdom` 来和实际UI匹配. 你可以在 setup 文件中手动修改 DOM, 或者传递一些参数来渲染组件。参考这个例子:

- https://github.com/nvh95/vitest-preview/tree/main/examples/svelte-testing-library#why-does-the-preview-ui-does-not-look-the-same-as-the-real-app-ui

## 配合 @vue/test-utils 使用时，预览页面空白了

`@vue/test-utils`默认不会把组件挂载到 jsdom 上。你需要把 `attachTo` 函数传递给 `mount` 函数来启用。参阅 <https://github.com/nvh95/vitest-preview/tree/main/examples/vue-test-utils#caveats>
