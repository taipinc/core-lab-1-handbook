// Page data uses source paths; sidebar links use extensionless site paths.
export function getChildPages(sidebar, relativePath) {
  const link = '/' + relativePath
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '')
  if (link === '/') return sidebar

  function find(items) {
    for (const item of items) {
      if (item.link === link) return item.items ?? []
      const children = item.items && find(item.items)
      if (children) return children
    }
  }

  return find(sidebar) ?? []
}
