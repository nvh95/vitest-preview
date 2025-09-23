<p align="center">
 <img align="center" alt="Vitest Preview Logo" src="https://user-images.githubusercontent.com/8603085/197406675-dbe5b555-3a71-4c6d-9547-776c18052881.svg" width="120"/>
</p>

<h1 align="center">
<a href="https://www.vitest-preview.com" target="_blank" >Vitest Preview</a>
</h1>

<p align="center">
Debug your Vitest tests. Effortlessly. 🧪🖼⚡️
</p>

<p align="center">
  <img align="center" src="https://user-images.githubusercontent.com/8603085/197373376-f6a3fe33-487b-4c35-8085-8e7e6357ce40.gif" alt="Vitest Preview Demo" />
</p>

<p align="center">
  <a href="https://stackblitz.com/edit/vitest-preview?file=src%2FApp.test.tsx,README.md" title="Try Vitest Preview Now" target="_blank">Try Vitest Preview Online</a>. No downloads needed!
</p>

<!-- prettier-ignore-start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- prettier-ignore-end -->

[![npm version](https://img.shields.io/npm/v/vitest-preview)](https://www.npmjs.com/package/vitest-preview)
[![Best of JS](https://img.shields.io/endpoint?url=https://bestofjs-serverless.now.sh/api/project-badge?fullName=nvh95%2Fvitest-preview%26since=weekly)](https://bestofjs.org/projects/vitest-preview)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](./CONTRIBUTING.md)
[![Mentioned in Awesome Jest](https://awesome.re/mentioned-badge.svg)](https://github.com/vitejs/awesome-vite#testing)

[![Try Vitest Preview now](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/vitest-preview?file=src%2FApp.test.tsx,README.md)

## Why **vitest-preview**

When writing tests, we usually have to debug by reading the cryptic HTML output on the terminal. Sometimes, they are too complicated to visualize the UI in our heads. `vitest-preview` previews your Vitest tests right in a browser, then you can see your actual UI visually. You can write tests and watch rendered output changes accordingly. Vitest Preview lets you concentrate on tests in the "real world" rather than deciphering HTML code.

`vitest-preview` is built on top of [Vite](https://vitejs.dev), it's blazing fast and easy to use.

`vitest-preview` is a younger sibling of [`jest-preview`](https://github.com/nvh95/jest-preview) with the same idea and to solve the same problem. If you are writing tests using Jest, [give it a try](https://stackblitz.com/edit/jest-preview?file=src%2FApp.test.tsx,README.md).

## Features

- 👀 Visualize your testing UI in an external browser in milliseconds.
- 🔄 Auto reloads the browser when `debug()` is executed.
- 💅 Fully support CSS
- 🌄 Support viewing images.

## Installation

```bash
npm install --save-dev vitest-preview
# Or
yarn add -D vitest-preview
pnpm add -D vitest-preview
```

## Configuration

### Process CSS

You need to configure `vitest` to process CSS by:

```diff
// vite.config.js
export default defineConfig({
  test: {
+    css: !process.env.CI, // We usually don't want to process CSS in CI
  },
});

```

You might want to import your CSS global files in `setupFiles`:

```diff
// vite.config.js
export default defineConfig({
  test: {
+    setupFiles: './src/test/setup.ts',
  },
});

```

```diff
// src/test/setup.ts
+import './global.css';
+import '@your-design-system/css/dist/index.min.css';
+import 'bootstrap/dist/css/bootstrap.min.css';

```

### Add script vitest-preview

`vitest-preview` has a CLI that opens **Vitest Preview Dashboard** where you can preview your tests' UI. You can update your `package.json` to add a script for more convenience:

```json
"scripts": {
  "vitest-preview": "vitest-preview"
},
```

## Usage

Put `debug()` wherever you want to see the UI in your tests.

```diff
+import { debug } from 'vitest-preview';

describe('App', () => {
  it('should work as expected', () => {
    render(<App />);
+    debug();
  });
});
```

Open the **Vitest Preview Dashboard** by running the CLI command (updated in [Configuration](#configuration)):

```bash
npm run vitest-preview
# Or
yarn vitest-preview
pnpm vitest-preview
```

Then execute your tests that contain `debug()`. You will see the UI of your tests at [http://localhost:5006](http://localhost:5006).

## Examples

- [react-testing-library](https://github.com/nvh95/vitest-preview/tree/main/examples/react-testing-library)
- [@vue/test-utils](https://github.com/nvh95/vitest-preview/tree/main/examples/vue-test-utils)

## Is there a similar library for Jest

Yes, it is. It's [Jest Preview](https://github.com/nvh95/jest-preview).

## Star history

[![Star History Chart](https://api.star-history.com/svg?repos=nvh95/vitest-preview&type=Date)](https://star-history.com/#nvh95/vitest-preview&Date)

## Contributing

Please see the contribution guide at [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://hung.dev"><img src="https://avatars.githubusercontent.com/u/8603085?v=4?s=100" width="100px;" alt="Hung Viet Nguyen"/><br /><sub><b>Hung Viet Nguyen</b></sub></a><br /><a href="https://github.com/nvh95/vitest-preview/commits?author=nvh95" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/KatFishSnake"><img src="https://avatars.githubusercontent.com/u/12003520?v=4?s=100" width="100px;" alt="Andre"/><br /><sub><b>Andre</b></sub></a><br /><a href="#example-KatFishSnake" title="Examples">💡</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/RiverTwilight"><img src="https://avatars.githubusercontent.com/u/52880665?v=4?s=100" width="100px;" alt="René Wang"/><br /><sub><b>René Wang</b></sub></a><br /><a href="#translation-RiverTwilight" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://blog.knappi.org"><img src="https://avatars.githubusercontent.com/u/636150?v=4?s=100" width="100px;" alt="Nils Knappmeier"/><br /><sub><b>Nils Knappmeier</b></sub></a><br /><a href="https://github.com/nvh95/vitest-preview/commits?author=nknapp" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/tarjei"><img src="https://avatars.githubusercontent.com/u/211263?v=4?s=100" width="100px;" alt="Tarjei Huse"/><br /><sub><b>Tarjei Huse</b></sub></a><br /><a href="#ideas-tarjei" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.truongnt.com"><img src="https://avatars.githubusercontent.com/u/36792554?v=4?s=100" width="100px;" alt="Truong Nguyen"/><br /><sub><b>Truong Nguyen</b></sub></a><br /><a href="https://github.com/nvh95/vitest-preview/pulls?q=is%3Apr+reviewed-by%3Antt261298" title="Reviewed Pull Requests">👀</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## License

![This is open source software](https://user-images.githubusercontent.com/8603085/161439058-98faea42-c6e6-46f4-9ce6-218fad5f3b9a.gif)

MIT

## Support

If you like the project, please consider supporting it by giving a ⭐️ to encourage the author.

<!-- TODO: Write a GitHub Actions to sync with root readme -->
