# Câu hỏi thường gặp

## Tại sao giao diện xem trước không giống với giao diện ứng dụng thực tế?

Nếu giao diện xem trước khác với giao diện ứng dụng thực tế, có 2 lý do có thể:

1. Bạn chưa import các file CSS toàn cục. Tham khảo <https://www.vitest-preview.com/guide/getting-started#process-css>

```js
// test/setup.ts
import '../global.css';
```

2. Cấu trúc HTML trong các bài test khác nhau. Bạn cần cập nhật `jsdom` để khớp với giao diện thực tế. Bạn có thể làm điều đó bằng cách thay đổi DOM trong file thiết lập, hoặc truyền một số tùy chọn cho hàm `render`. Xem ví dụ tại:

- https://github.com/nvh95/vitest-preview/tree/main/examples/svelte-testing-library#why-does-the-preview-ui-does-not-look-the-same-as-the-real-app-ui

## Xem trước trống khi tôi sử dụng với @vue/test-utils

Theo mặc định, `@vue/test-utils` không gắn component vào jsdom. Bạn cần truyền `attachTo` cho hàm `mount` để làm cho nó hoạt động. Xem thêm tại <https://github.com/nvh95/vitest-preview/tree/main/examples/vue-test-utils#caveats>
