import { defineConfig } from 'vitepress';
import { version } from '../../../packages/vitest-preview/package.json';

export default defineConfig({
  lang: 'en-US',
  title: 'Vitest Preview',
  description: 'Visual Debugging Experience for Vitest 🧪🖼⚡️',

  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['link', { rel: 'icon', href: '/logo.svg' }],
    [
      'script',
      {
        async: '',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-YKHHWE1K76',
      },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-YKHHWE1K76');`,
    ],
  ],

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
      '/zh/guide/': sidebarGuideCN(),
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

    // TODO: Wait until Algolia Docsearch request get approved
    // algolia: {
    //   appId: 'VFA88CUWX7',
    //   apiKey: '8354d53c7d31449dc1312e81d441fbf4',
    //   indexName: 'vitest-preview',
    // },
  },
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
    {
      text: 'Language',
      items: [
        {
          text: 'English',
          link: '/',
        },
        {
          text: '中文',
          link: '/zh/',
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
    {
      text: 'Others',
      collapsible: true,
      items: [
        {
          text: 'Frequently Asked Questions',
          link: '/guide/faq',
        },
      ],
    },
  ];
}

function sidebarGuideCN() {
  return [
    {
      text: '介绍',
      collapsible: true,
      items: [
        {
          text: 'Vitest Preview 是什么？',
          link: '/zh/guide/what-is-vitest-preview',
        },
        { text: '起步', link: '/zh/guide/getting-started' },
      ],
    },
    {
      text: '示例',
      collapsible: true,
      items: [
        { text: 'React 测试库', link: '/zh/guide/react-testing-library' },
        { text: '@vue/test-utils', link: '/zh/guide/vue-test-utils' },
        {
          text: 'Svelte 测试库',
          link: '/zh/guide/svelte-testing-library',
        },
      ],
    },
    {
      text: '其它',
      collapsible: true,
      items: [
        {
          text: '常见问题',
          link: '/zh/guide/faq',
        },
      ],
    },
  ];
}
