import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { createSectionSidebars, generateNavigation } from '../.vitepress/navigation.mjs'

async function withPages(pages, check) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'handbook-navigation-'))
  try {
    for (const [name, source] of Object.entries(pages)) {
      const file = path.join(directory, name)
      mkdirSync(path.dirname(file), { recursive: true })
      writeFileSync(file, source)
    }
    await check(directory)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
}

const page = metadata => `---\n${metadata}\n---\n\n# {{ $frontmatter.title }}\n`

test('switching sections opens the current group and collapses the others', () => {
  const sidebar = [
    { text: 'Capture', link: '/capture/', collapsed: true, items: [
      { text: 'Basics', link: '/capture/basics' }
    ] },
    { text: 'Lightroom', link: '/lightroom/', collapsed: true, items: [
      { text: 'Import', link: '/lightroom/import' }
    ] }
  ]
  const sidebars = createSectionSidebars(sidebar)
  const capture = sidebars['/capture/']
  assert.deepEqual(capture.map(item => item.collapsed), [false, true])
  const lightroom = sidebars['/lightroom/']
  assert.deepEqual(lightroom.map(item => item.collapsed), [true, false])
  // VitePress compares serialized configurations before resetting toggle state.
  assert.notEqual(JSON.stringify(capture), JSON.stringify(lightroom))
  assert.deepEqual(Object.keys(sidebars), ['/', '/capture/', '/lightroom/'])
  assert.deepEqual(sidebars['/'], sidebar)
  assert.deepEqual(sidebar.map(item => item.collapsed), [true, true])
  assert.deepEqual(lightroom.map(item => item.items), sidebar.map(item => item.items))
})

test('uses menu titles, title fallback, sibling order, and folder hierarchy', async () => {
  await withPages({
    'index.md': page('title: Home'),
    'print/index.md': page('title: Print\norder: 2'),
    'capture/index.md': page('title: Capture\norder: 1'),
    'capture/later.md': page('title: Later\norder: 2'),
    'capture/first.md': page('title: A longer page title\nmenuTitle: "Capture: basics"\norder: 1'),
    'capture/advanced/index.md': page('title: Advanced\norder: 3'),
    'capture/advanced/detail.md': page('title: Detail')
  }, async directory => {
    const { nav, sidebar } = await generateNavigation(directory)
    assert.deepEqual(nav, [
      { text: 'Home', link: '/' },
      { text: 'Capture', link: '/capture/' },
      { text: 'Print', link: '/print/' }
    ])
    assert.deepEqual(sidebar[0].items.map(item => item.text), ['Capture: basics', 'Later', 'Advanced'])
    assert.equal(sidebar[0].items[0].link, '/capture/first')
    assert.equal(sidebar[0].collapsed, true)
    assert.equal(sidebar[0].items[2].collapsed, true)
    assert.deepEqual(sidebar[0].items[2].items, [{ text: 'Detail', link: '/capture/advanced/detail' }])
  })
})

test('omits hidden pages, hidden sections, and include directories', async () => {
  await withPages({
    'index.md': page('title: Home'),
    'hidden.md': page('title: Hidden\nmenu: false'),
    'private/index.md': page('title: Private\nmenu: false'),
    'private/child.md': page('title: Child'),
    '_includes/example.md': 'Shared content without metadata'
  }, async directory => {
    assert.deepEqual(await generateNavigation(directory), {
      nav: [{ text: 'Home', link: '/' }], sidebar: []
    })
  })
})

test('places unordered pages last and resolves tied orders consistently', async () => {
  await withPages({
    'index.md': page('title: Home'),
    'page-10.md': page('title: Ten\norder: 1'),
    'page-2.md': page('title: Two\norder: 1'),
    'a.md': page('title: Unordered')
  }, async directory => {
    const { sidebar } = await generateNavigation(directory)
    assert.deepEqual(sidebar.map(item => item.text), ['Two', 'Ten', 'Unordered'])
  })
})

test('reports invalid metadata and missing parent pages clearly', async () => {
  for (const [metadata, message] of [
    ['order: 1', /title/],
    ['title: Example\nmenuTitle: false', /menuTitle/],
    ['title: Example\norder: first', /order/],
    ['title: Example\nmenu: hidden', /menu must/]
  ]) {
    await withPages({ 'invalid.md': page(metadata) }, async directory => {
      await assert.rejects(generateNavigation(directory), message)
    })
  }
  await withPages({ 'section/child.md': page('title: Child') }, async directory => {
    await assert.rejects(generateNavigation(directory), /section: add index.md/)
  })
})
