<script setup lang="ts">
withDefaults(defineProps<{
  src: string
  title: string
  height?: string
}>(), {
  height: '640px'
})
</script>

<template>
  <figure class="website-embed">
    <iframe
      :src="src"
      :title="title"
      :style="{ height }"
      loading="lazy"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    />
    <figcaption>
      <span>{{ title }}</span>
      <a :href="src" target="_blank" rel="noopener noreferrer">Open in new tab ↗</a>
    </figcaption>
  </figure>
</template>

<style scoped>
.website-embed {
  margin: 24px 0;
}

.website-embed iframe {
  display: block;
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.website-embed figcaption {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 16px;
  margin-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

@media print {
  .website-embed iframe {
    display: none;
  }
}
</style>
