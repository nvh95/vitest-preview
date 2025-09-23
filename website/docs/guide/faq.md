# Frequently Asked Questions

## Why doesn't the preview UI look the same as the real app UI?

If the preview UI is different from the real app UI, there are 2 possible reasons:

1. You haven't imported global CSS files yet. Refer to <https://www.vitest-preview.com/guide/getting-started#process-css>

```js
// test/setup.ts
import '../global.css';
```

2. The HTML structure in tests is different. You need to update the `jsdom` to match the real UI. You can do that by mutating the DOM in the setup file, or pass some options to `render` function. See an example at:

- https://github.com/nvh95/vitest-preview/tree/main/examples/svelte-testing-library#why-doesnt-the-preview-ui-look-the-same-as-the-real-app-ui

## The preview is blank when I use with @vue/test-utils

By default, `@vue/test-utils` does not mount the component to the jsdom. You need to pass `attachTo` to `mount` function to make it work. See more at <https://github.com/nvh95/vitest-preview/tree/main/examples/vue-test-utils#caveats>
