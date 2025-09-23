---
'vitest-preview': patch
'@vitest-preview/dev-utils': patch
---

## What's changed
### New features
- Better support CSS-in-JS to support CSSOM `insertRule` (e.g: emotion, Chakra, Material UI...)
- Expose Vitest Preview Dashboard to network
- Allow to configure `externalCss`
- Expose `startServer`, `stopServer` APIs
- Auto choose available port
- No need to add `.vitest-preview` to `.gitignore`
### Misc
- Add more examples: `chakra-react`, `mui-react`, `react-testing-library`, `svelte-testing-library`, `vue-test-utils`
- Build pipeline uses `pkgroll`
- Chinese documentation translations
- Better print Vitest Preview Server local and network URLs
