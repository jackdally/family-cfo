import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'FamilyCFO',
  tagline: 'Luxury-grade personal finance platform for boutique family offices',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://familycfo.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'jackdally', // Usually your GitHub org/user name.
  projectName: 'family-cfo', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/jackdally/family-cfo/tree/main/docs-site/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/jackdally/family-cfo/tree/main/docs-site/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/familycfo-social-card.jpg',
    navbar: {
      title: 'FamilyCFO',
      logo: {
        alt: 'FamilyCFO Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/project-overview',
          label: 'Project Overview',
          position: 'left',
        },
        {
          to: '/roadmap',
          label: 'Roadmap',
          position: 'left',
        },
        {
          to: '/api',
          label: 'API',
          position: 'left',
        },
        {
          to: '/development',
          label: 'Development',
          position: 'left',
        },
        {
          href: 'https://github.com/jackdally/family-cfo',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'Project Overview',
              to: '/project-overview',
            },
            {
              label: 'API Reference',
              to: '/api',
            },
            {
              label: 'Development Guide',
              to: '/development',
            },
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'Roadmap',
              to: '/roadmap',
            },
            {
              label: 'Data Dictionary',
              to: '/docs/data-dictionary',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/jackdally/family-cfo',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Issues',
              href: 'https://github.com/jackdally/family-cfo/issues',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/jackdally/family-cfo/discussions',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} FamilyCFO. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
