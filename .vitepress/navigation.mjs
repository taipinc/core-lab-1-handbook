import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { createMarkdownRenderer, disposeMdItInstance } from 'vitepress'

// Each section keeps the full menu, but starts with only its own group open.
// Changing sections changes the sidebar configuration, which resets VitePress's
// local toggle state. Pages within a section share a configuration so manual
// toggles remain available without being reset on every page change.
export function createSectionSidebars(sidebar) {
  const sidebars = { '/': sidebar }
  for (const active of sidebar) {
    if (!active.items?.length || !active.link?.endsWith('/')) continue
    sidebars[active.link] = sidebar.map(item => ({
      ...item,
      ...(item.items?.length ? { collapsed: item.link !== active.link } : {})
    }))
  }
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
    return {
      text: data.menuTitle ?? data.title,
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
      text: page.text,
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
        .map(({ text, link }) => ({ text, link })),
      sidebar: children.map(sidebarItem)
    }
  } finally {
    // Release the parser before VitePress initializes its site renderer.
    disposeMdItInstance()
  }
}
