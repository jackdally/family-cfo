import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Core Documentation',
      items: [
        'data-dictionary',
      ],
    },
    {
      type: 'category',
      label: 'Project Documentation',
      items: [
        'project-overview',
        'roadmap',
        'api',
        'development',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'development/current-status',
        'development/feature-development',
      ],
    },
  ],
};

export default sidebars;
