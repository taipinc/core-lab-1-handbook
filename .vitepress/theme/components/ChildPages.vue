<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { VPFeatures } from 'vitepress/theme'
import { getChildPages } from '../child-pages.mjs'

const { page, theme } = useData()
const features = computed(() => {
  // The root configuration contains the complete, generated menu tree.
  const sidebar = theme.value.sidebar
  const items = Array.isArray(sidebar) ? sidebar : sidebar?.['/'] ?? []
  return getChildPages(items, page.value.relativePath).map(item => ({
    title: item.label ?? item.text,
    icon: item.icon,
    link: item.link
  }))
})
</script>

<template>
  <nav v-if="features.length" class="child-pages" aria-label="Pages in this section">
    <VPFeatures :features="features" />
  </nav>
</template>

<style scoped>
.child-pages {
  margin: 1.5rem 0;
}

.child-pages :deep(.VPFeatures) {
  padding: 0;
}

.child-pages :deep(.items) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.child-pages :deep(.items > .item) {
  width: 100%;
  margin: 0;
  padding: 0;
}

/* The homepage cards also sit inside prose on reference pages. */
.child-pages :deep(.VPFeature) {
  color: var(--vp-c-text-1);
  font-weight: inherit;
  text-decoration: none;
}

.child-pages :deep(.title) {
  margin: 0;
  border: 0;
  padding: 0;
  letter-spacing: normal;
}

.child-pages :deep(.VPFeature:focus-visible) {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}
</style>
