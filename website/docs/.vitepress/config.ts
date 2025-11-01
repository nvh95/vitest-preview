import { defineConfig, DefaultTheme } from 'vitepress';
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
    algolia: {
      appId: 'BUN7XA5D5V',
      apiKey: '6a52894da235fe49212c2bc60b9589a3',
      indexName: 'Vitest Preview',
    },
  },
  ignoreDeadLinks: 'localhostLinks',
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

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        {
          text: 'What is Vitest Preview?',
          link: '/guide/what-is-vitest-preview',
        },
        { text: 'Getting Started', link: '/guide/getting-started' },
      ],
    },
    {
      text: 'Automatic Mode',
      items: [
        {
          text: 'What is Automatic Mode?',
          link: '/guide/what-is-automatic-mode',
        },
        {
          text: 'Auto Preview on Failed Tests',
          link: '/guide/auto-preview-on-failed-tests',
        },
        {
          text: 'Auto Preview on DOM Changes',
          link: '/guide/auto-preview-on-dom-changes',
        },
      ],
    },
    {
      text: 'APIs',
      collapsed: false,
      items: [
        {
          text: 'debug',
          link: '/guide/api/debug',
        },
        {
          text: 'watch',
          link: '/guide/api/watch',
        },
        {
          text: 'configure',
          link: '/guide/api/configure',
        },
        {
          text: 'Vitest Preview Dashboard',
          link: '/guide/api/vitest-preview-dashboard',
        },
      ],
    },
    {
      text: 'Examples',
      collapsed: false,
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
      collapsed: false,
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
        { text: '自动模式', link: '/zh/guide/automatic-mode' },
      ],
    },
    {
      text: '自动模式',
      collapsible: true,
      items: [
        {
          text: '什么是自动模式？',
          link: '/zh/guide/what-is-automatic-mode',
        },
        {
          text: '测试失败时自动预览',
          link: '/zh/guide/auto-preview-on-failed-tests',
        },
        {
          text: 'DOM 变化时自动预览',
          link: '/zh/guide/auto-preview-on-dom-changes',
        },
      ],
    },
    {
      text: 'APIs',
      collapsible: true,
      items: [
        {
          text: 'debug',
          link: '/zh/guide/api/debug',
        },
        {
          text: 'watch',
          link: '/zh/guide/api/watch',
        },
        {
          text: 'configure',
          link: '/zh/guide/api/configure',
        },
        {
          text: 'Vitest Preview Dashboard',
          link: '/zh/guide/api/vitest-preview-dashboard',
        },
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
