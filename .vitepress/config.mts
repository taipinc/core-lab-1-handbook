import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { createSectionSidebars, generateNavigation } from './navigation.mjs'

export default async () => {
  const contentDir = fileURLToPath(new URL('../content/', import.meta.url))
  const { nav, sidebar } = await generateNavigation(contentDir)

  return defineConfig({
    base: '/core-lab-1-handbook/',
    title: 'Core Lab 1 Handbook',
    description: 'Photographic Workflows from Capture to Print',
    srcDir: 'content',
    srcExclude: ['_includes/**'],
    themeConfig: { nav, sidebar: createSectionSidebars(sidebar) }
  })
}
