import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { createSectionSidebars, generateNavigation } from './navigation.mjs'

export default async () => {
  const contentDir = fileURLToPath(new URL('../content/', import.meta.url))
  const { nav, sidebar } = await generateNavigation(contentDir)
  const pageIcons = new Map<string, string>()
  function collectIcons(items) {
    for (const item of items) {
      if (item.icon) pageIcons.set(item.link, item.icon)
      if (item.items) collectIcons(item.items)
    }
  }
  collectIcons(sidebar)

  return defineConfig({
    base: '/core-lab-1-handbook/',
    title: 'Core Lab 1 Handbook',
    description: 'Photographic Workflows from Capture to Print',
    srcDir: 'content',
    srcExclude: ['_includes/**'],
    transformPageData(pageData) {
      // Reuse each destination page's icon on manually configured home cards.
      const features = pageData.frontmatter.features
      if (Array.isArray(features)) {
        for (const feature of features) {
          if (feature.icon === undefined && pageIcons.has(feature.link)) {
            feature.icon = pageIcons.get(feature.link)
          }
        }
      }
    },
    themeConfig: { nav, sidebar: createSectionSidebars(sidebar) }
  })
}
