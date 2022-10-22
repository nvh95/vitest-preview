<!-- TODO: Write a GitHub Actions to sync with root readme -->
<h1 align="center">
Vitest Preview
</h1>

<p align="center">
Debug your Vitest tests. Effortlessly. 🛠🖼
</p>

<!-- TODO: Add GIF -->

<p align="center">
  <a href="https://stackblitz.com/edit/vitest-preview?file=src%2FApp.test.tsx,README.md" title="Try Vitest Preview Now" target="_blank">Try Vitest Preview Online</a>. No downloads needed!
</p>

[![npm version](https://img.shields.io/npm/v/vitest-preview)](https://www.npmjs.com/package/vitest-preview)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](./CONTRIBUTING.md)

[![Try Vitest Preview now](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/vitest-preview?file=src%2FApp.test.tsx,README.md)

## Why **vitest-preview**

When writing tests, we usually have to debug by reading the cryptic HTML output on the terminal. Sometimes, they are too complicated to visualize the UI in our heads. `vitest-preview` previews your Vitest tests right in a browser, then you can see your actual UI visually. You can write tests and watch rendered output changes accordingly. Vitest Preview lets you concentrate on tests in the "real world" rather than deciphering HTML code.

TODO: Built on Vite, fast and easy to use.

`vitest-preview` is a younger sibling of [Jest Preview](https://github.com/nvh95/jest-preview) with the same idea and to solve the same problem. If you are writing tests using Jest, [give it a try](https://stackblitz.com/edit/jest-preview?file=src%2FApp.test.tsx,README.md).

## Features

## Usage

2 lines of code

```
+import preview from 'vitest-preview';

describe('App', () => {
  it('should work as expected', () => {
    render(<App />);
+    preview.debug();
  });
});
```

TODO: vitest-preview CLI

Add global CSS to test setup file

## Installation

```bash
npm install --save-dev vitest-preview
# Or
yarn add --dev vitest-preview
pnpm add -D vitest-preview
```
