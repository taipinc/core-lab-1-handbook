import assert from 'node:assert/strict'
import test from 'node:test'
import { getChildPages } from '../.vitepress/theme/child-pages.mjs'

const adjustments = {
  text: 'Adjustments', link: '/photoshop/adjustments/', items: [
    { text: 'Light', link: '/photoshop/adjustments/light' },
    { text: 'Color and Vibrance', link: '/photoshop/adjustments/color-and-vibrance' }
  ]
}
const sidebar = [{
  text: 'Photoshop', link: '/photoshop/', items: [
    adjustments, { text: 'Layers', link: '/photoshop/layers' }
  ]
}]

test('parent galleries show immediate menu children in menu order', () => {
  assert.deepEqual(getChildPages(sidebar, 'photoshop/index.md'), sidebar[0].items)
  assert.deepEqual(getChildPages(sidebar, 'photoshop/adjustments/index.md'), adjustments.items)
  assert.deepEqual(getChildPages(sidebar, 'index.md'), sidebar)
})

test('leaf and unlisted pages have no child cards', () => {
  assert.deepEqual(getChildPages(sidebar, 'photoshop/adjustments/light.md'), [])
  assert.deepEqual(getChildPages(sidebar, 'photoshop/layers.md'), [])
  assert.deepEqual(getChildPages(sidebar, 'unlisted/index.md'), [])
})
