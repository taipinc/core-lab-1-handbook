<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

const props = withDefaults(defineProps<{
  src: string
  externalUrl?: string
  title: string
  height?: string
  expandable?: boolean
}>(), {
  height: '640px',
  expandable: false
})

const dialog = ref<HTMLDialogElement>()
const expanded = ref(false)
const dialogTitleId = useId()
let previousOverflow: string | undefined

function restoreScroll() {
  if (previousOverflow !== undefined) {
    document.documentElement.style.overflow = previousOverflow
    previousOverflow = undefined
  }
}

async function expand() {
  if (expanded.value || !props.expandable) return
  expanded.value = true
  await nextTick()
  if (!dialog.value?.isConnected || !props.expandable) {
    expanded.value = false
    return
  }
  dialog.value.showModal()
  previousOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'
}

function close() {
  dialog.value?.close()
}

function onClose() {
  expanded.value = false
  restoreScroll()
}

watch(() => props.expandable, enabled => {
  if (!enabled) close()
})

onBeforeUnmount(() => {
  close()
  restoreScroll()
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
      <span class="website-embed-actions">
        <a :href="externalUrl || src" target="_blank" rel="noopener noreferrer">Open in new tab ↗</a>
        <button
          v-if="expandable"
          type="button"
          class="website-embed-expand"
          :aria-label="`Expand ${title}`"
          aria-haspopup="dialog"
          @click="expand"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 3l6 6m12-6-6 6M3 21l6-6m12 6-6-6" />
          </svg>
          Expand
        </button>
      </span>
    </figcaption>
  </figure>

  <ClientOnly>
    <Teleport to="body">
      <dialog
        ref="dialog"
        class="website-embed-dialog"
        :aria-labelledby="dialogTitleId"
        @close="onClose"
        @click="event => { if (event.target === dialog) close() }"
      >
        <div class="website-embed-dialog-content">
          <header class="website-embed-dialog-header">
            <span :id="dialogTitleId">{{ title }}</span>
            <button type="button" class="website-embed-close" autofocus aria-label="Close expanded website" @click="close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
              Close
            </button>
          </header>
          <iframe
            v-if="expanded"
            :src="src"
            :title="`${title} — expanded view`"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          />
        </div>
      </dialog>
    </Teleport>
  </ClientOnly>
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

.website-embed-actions,
.website-embed-expand,
.website-embed-close {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.website-embed-actions {
  flex-wrap: wrap;
  gap: 8px 16px;
}

.website-embed-expand,
.website-embed-close {
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  font: inherit;
  cursor: pointer;
}

.website-embed-expand:hover,
.website-embed-close:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.website-embed-expand:focus-visible,
.website-embed-close:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.website-embed-expand svg,
.website-embed-close svg {
  width: 18px;
  height: 18px;
}

.website-embed-dialog {
  --embed-padding: clamp(8px, 2vw, 32px);
  width: calc(100vw - 2 * var(--embed-padding));
  height: calc(100vh - 2 * var(--embed-padding));
  height: calc(100dvh - 2 * var(--embed-padding));
  max-width: none;
  max-height: none;
  margin: auto;
  padding: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  box-shadow: 0 16px 64px rgb(0 0 0 / 30%);
  overflow: hidden;
}

.website-embed-dialog::backdrop {
  background: rgb(0 0 0 / 65%);
}

.website-embed-dialog-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.website-embed-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 14px;
}

.website-embed-dialog-content > iframe {
  display: block;
  flex: 1;
  min-height: 0;
  width: 100%;
  border: 0;
}

@media print {
  .website-embed iframe,
  .website-embed-expand,
  .website-embed-dialog {
    display: none;
  }
}
</style>
