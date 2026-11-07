import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { createMarkdownRenderer, disposeMdItInstance } from 'vitepress'
import { renderIcon, menuText } from './icons.mjs'

// Each section keeps the full menu, with only its ancestor groups open.
// Nested sections share a configuration across their overview and child pages.
// Leaving a section resets its toggles; manual toggles within it are preserved.
export function createSectionSidebars(sidebar) {
  const sidebars = { '/': sidebar }

  function forSection(items, activeLink) {
    return items.map(item => ({
      ...item,
      ...(item.items?.length ? {
        collapsed: !activeLink.startsWith(item.link),
        items: forSection(item.items, activeLink)
      } : {})
    }))
  }

  function addSections(items) {
    for (const item of items) {
      if (!item.items?.length || !item.link?.endsWith('/')) continue
      sidebars[item.link] = forSection(sidebar, item.link)
      addSections(item.items)
    }
  }

  addSections(sidebar)
  return sidebars
}

// Use VitePress's own YAML parser so metadata has the same meaning everywhere.
export async function generateNavigation(contentDir) {
  const markdown = await createMarkdownRenderer(contentDir)

  function readPage(file) {
    const env = { path: file, relativePath: path.relative(contentDir, file) }
    markdown.parse(readFileSync(file, 'utf8'), env)
    const data = env.frontmatter ?? {}
    const relative = path.relative(contentDir, file).split(path.sep).join('/')
    const fail = message => { throw new Error(`${relative}: ${message}`) }
    if (typeof data.title !== 'string' || !data.title.trim()) {
      fail('provide a nonempty title in frontmatter')
    }
    if (data.menuTitle !== undefined &&
        (typeof data.menuTitle !== 'string' || !data.menuTitle.trim())) {
      fail('menuTitle must be a nonempty string when provided')
    }
    if (data.order !== undefined &&
        (typeof data.order !== 'number' || !Number.isFinite(data.order))) {
      fail('order must be a finite number when provided')
    }
    if (data.menu !== undefined && typeof data.menu !== 'boolean') {
      fail('menu must be true or false when provided')
    }
    let icon
    if (data.icon !== undefined) {
      try { icon = renderIcon(data.icon) } catch (error) { fail(error.message) }
    }
    return {
      text: data.menuTitle ?? data.title,
      ...(icon ? { icon } : {}),
      link: '/' + relative.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, ''),
      order: data.order ?? Number.MAX_SAFE_INTEGER,
      visible: data.menu !== false,
      file: relative
    }
  }

  const sortPages = pages => pages.sort((a, b) =>
    a.order - b.order || a.file.localeCompare(b.file, 'en', { numeric: true }))

  function readDirectory(directory) {
    const entries = readdirSync(directory, { withFileTypes: true })
      .filter(entry => !entry.name.startsWith('_') && !entry.name.startsWith('.'))
    const children = []
    let parent
    for (const entry of entries) {
      const file = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        const section = readDirectory(file)
        if (!section.parent) {
          // Asset-only folders do not define navigation sections.
          if (!section.children.length) continue
          throw new Error(`${path.relative(contentDir, file)}: add index.md for the parent page`)
        }
        if (section.parent.visible) {
          children.push({ ...section.parent, children: section.children })
        }
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const page = readPage(file)
        if (entry.name === 'index.md') parent = page
        else if (page.visible) children.push(page)
      }
    }
    return { parent, children: sortPages(children) }
  }

  function sidebarItem(page) {
    return {
      text: menuText(page.text, page.icon),
      ...(page.icon ? { label: page.text, icon: page.icon } : {}),
      link: page.link,
      ...(page.children?.length ? {
        collapsed: true,
        items: page.children.map(sidebarItem)
      } : {})
    }
  }

  try {
    const { parent, children } = readDirectory(contentDir)
    return {
      nav: [...(parent?.visible ? [parent] : []), ...children]
        .map(({ text, link, icon }) => ({ text: menuText(text, icon), link })),
      sidebar: children.map(sidebarItem)
    }
  } finally {
    // Release the parser before VitePress initializes its site renderer.
    disposeMdItInstance()
  }
}
