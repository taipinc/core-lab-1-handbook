import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const iconsDir = path.join(path.dirname(require.resolve('lucide-static/package.json')), 'icons')
const photoshopDir = fileURLToPath(new URL('./theme/icons/photoshop/', import.meta.url))
const cache = new Map()

export function renderIcon(name) {
  if (typeof name !== 'string' || !/^(photoshop:)?[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error('icon must be a lowercase, hyphenated Lucide name, such as camera, or a custom name such as photoshop:curves')
  }
  if (!cache.has(name)) {
    let svg
    const custom = name.startsWith('photoshop:')
    try {
      svg = readFileSync(path.join(custom ? photoshopDir : iconsDir, `${custom ? name.slice(10) : name}.svg`), 'utf8')
    } catch {
      throw new Error(custom
        ? `unknown Photoshop icon "${name}"; check .vitepress/theme/icons/photoshop/`
        : `unknown Lucide icon "${name}"; choose a name from https://lucide.dev/icons/`)
    }
    cache.set(name, svg.slice(svg.indexOf('<svg'))
      .replace('<svg', '<svg aria-hidden="true" focusable="false"')
      .replace(/stroke-width="[^"]*"/, custom ? 'stroke-width="1.5"' : 'stroke-width="1.75"').trim())
  }
  return cache.get(name)
}

export function menuText(label, icon) {
  if (!icon) return label
  const escaped = label.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character])
  return `<span class="menu-page-label">${icon}<span>${escaped}</span></span>`
}
