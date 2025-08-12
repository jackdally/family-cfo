import { Config } from '@docusaurus/types'

const config: Config = {
  title: 'Family CFO Docs',
  url: 'https://jackdally.github.io',
  baseUrl: '/family-cfo/',
  favicon: 'img/favicon.ico',
  organizationName: 'jackdally',
  projectName: 'family-cfo',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          path: '../',
          routeBasePath: '/',
          exclude: [
            '**/site/node_modules/**',
            '**/site/.docusaurus/**',
          ],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}

export default config

