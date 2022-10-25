import { defineConfig } from 'vitepress';
import { version } from '../../../packages/vitest-preview/package.json';

export default defineConfig({
  lang: 'en-US',
  title: 'Vitest Preview',
  description: 'Visual Debugging Experience for Vitest 🧪🖼⚡️',

  lastUpdated: true,
  cleanUrls: 'without-subfolders',

  head: [['meta', { name: 'theme-color', content: '#3c8772' }]],

  markdown: {
    headers: {
      level: [0, 0],
    },
  },

  themeConfig: {
    nav: nav(),
    logo: 'logo.svg',
    sidebar: {
      '/guide/': sidebarGuide(),
    },

    editLink: {
      pattern: 'https://github.com/nvh95/vitest-preview/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/nvh95/vitest-preview' },
      { icon: 'twitter', link: 'https://twitter.com/VitestPreview' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Hung Nguyen',
    },
  },
  appearance: 'dark',
});

function nav() {
  return [
    {
      text: 'Guide',
      link: '/guide/what-is-vitest-preview',
      activeMatch: '/guide/',
    },
    {
      text: 'Jest Preview',
      link: 'https://www.jest-preview.com/',
    },
    {
      text: version,
      items: [
        {
          text: 'Release',
          link: 'https://github.com/nvh95/vitest-preview/releases',
        },
        {
          text: 'Contributing',
          link: 'https://github.com/nvh95/vitest-preview/blob/main/CONTRIBUTING.md',
        },
      ],
    },
  ];
}

function sidebarGuide() {
  return [
    {
      text: 'Introduction',
      collapsible: true,
      items: [
        {
          text: 'What is Vitest Preview?',
          link: '/guide/what-is-vitest-preview',
        },
        { text: 'Getting Started', link: '/guide/getting-started' },
      ],
    },
    {
      text: 'Examples',
      collapsible: true,
      items: [
        { text: 'React Testing Library', link: '/guide/react-testing-library' },
        { text: '@vue/test-utils', link: '/guide/vue-test-utils' },
        {
          text: 'Svelte Testing library',
          link: '/guide/svelte-testing-library',
        },
      ],
    },
  ];
}
