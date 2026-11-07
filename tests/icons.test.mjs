import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import test from 'node:test'
import { renderIcon } from '../.vitepress/icons.mjs'

test('all custom adjustment icons render as decorative SVGs', () => {
  const files = readdirSync(new URL('../.vitepress/theme/icons/photoshop/', import.meta.url))
    .filter(file => file.endsWith('.svg'))
  assert.equal(files.length, 10)
  for (const file of files) {
    const svg = renderIcon(`photoshop:${file.slice(0, -4)}`)
    assert.match(svg, /^<svg aria-hidden="true" focusable="false"/)
    assert.match(svg, /viewBox="0 0 24 24"/)
    assert.match(svg, /currentColor/)
    assert.doesNotMatch(svg, /\bid=|href=|<script/)
  }
})

test('custom icon lookup rejects unknown names and path traversal', () => {
  assert.throws(() => renderIcon('photoshop:missing'), /unknown Photoshop icon/)
  assert.throws(() => renderIcon('photoshop:../camera'), /icon must/)
  assert.match(renderIcon('camera'), /lucide-camera/)
})
