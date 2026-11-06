import { defineConfig } from 'vitepress'

const sections = [
  { text: 'Capture', link: '/capture/' },
  { text: 'Lightroom', link: '/lightroom/' },
  { text: 'Photoshop', link: '/photoshop/' },
  { text: 'Scanning', link: '/scanning/' },
  { text: 'Print', link: '/print/' }
]

export default defineConfig({
  base: '/core-lab-1-handbook/',
  title: 'Core Lab 1 Handbook',
  description: 'Photographic Workflows from Capture to Print',
  srcExclude: ['_includes/**', 'AGENTS.md', 'README.md'],
  themeConfig: {
    nav: [{ text: 'Home', link: '/' }, ...sections],
    sidebar: sections.map(section => ({
      ...section,
      collapsed: false,
      items: Array.from({ length: 3 }, (_, index) => ({
        text: `Child Page ${index + 1}`,
        link: `${section.link}child-page-${index + 1}`
      }))
    }))
  }
})
