# debug

`debug` 函数是 Vitest Preview 的核心 API。它捕获 DOM 的当前状态，并使其可在浏览器中预览。

## 用法

```ts
import { debug } from 'vitest-preview';

test('正确渲染', () => {
  render(<YourComponent />);

  // 调用 debug 捕获当前 DOM 状态
  debug();
});
```


然后可以通过 Vitest Preview 服务器在浏览器中查看捕获的 HTML，使你能够直观地检查渲染的组件。

## 注意事项

- 在测试中你想要捕获 DOM 状态的点调用 `debug()`
- 你可以在测试中多次调用 `debug()` 以捕获不同的状态
- 预览将显示最近一次 debug 调用的输出
