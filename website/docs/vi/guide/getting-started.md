# Bắt đầu

Phần này sẽ hướng dẫn bạn qua quá trình sử dụng trải nghiệm kiểm thử trực quan với `vitest-preview`. Bạn có thể thử nó mà không cần cài đặt bất cứ thứ gì tại [StackBlitz](https://stackblitz.com/edit/vitest-preview?file=src%2FApp.test.tsx,README.md).

[![Thử Vitest Preview ngay](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/vitest-preview?file=src%2FApp.test.tsx,README.md)

<p align="center">
  <img align="center" src="https://user-images.githubusercontent.com/8603085/197373376-f6a3fe33-487b-4c35-8085-8e7e6357ce40.gif" alt="Vitest Preview Demo" />
</p>

::: warning
Nếu bạn đang sử dụng Jest, bạn có thể thử [jest-preview](https://github.com/nvh95/jest-preview) với chức năng tương tự.
:::

## Bước 1: Cài đặt

```bash
npm install --save-dev vitest-preview
# Hoặc
yarn add -D vitest-preview
pnpm add -D vitest-preview
```

## Bước 2: Cấu hình

### Xử lý CSS

Bạn cần cấu hình `vitest` để xử lý CSS bằng cách:

```diff
// vite.config.js
export default defineConfig({
  test: {
+    css: !process.env.CI, // Thông thường chúng ta không muốn xử lý CSS trong CI
  },
});

```

Bạn có thể muốn import các file CSS toàn cục trong `setupFiles`:

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

### Thêm script vitest-preview

`vitest-preview` có một CLI mở **Vitest Preview Dashboard** nơi bạn có thể xem trước giao diện người dùng của các bài test. Bạn có thể cập nhật `package.json` để thêm một script để thuận tiện hơn:

```json
"scripts": {
  "vitest-preview": "vitest-preview"
},
```

## Bước 3: Sử dụng

Đặt `debug()` ở bất cứ đâu bạn muốn xem giao diện người dùng trong các bài test của bạn.

```diff
+import { debug } from 'vitest-preview';

describe('App', () => {
  it('should work as expected', () => {
    render(<App />);
+    debug();
  });
});
```

Mở **Vitest Preview Dashboard** bằng cách chạy lệnh CLI (đã cập nhật trong [Cấu hình](#bước-2-cấu-hình)):

```bash
npm run vitest-preview
# Hoặc
yarn vitest-preview
pnpm vitest-preview
```

Sau đó thực thi các bài test của bạn có chứa `debug()`. Bạn sẽ thấy giao diện người dùng của các bài test của bạn tại localhost:5006.
