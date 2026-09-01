<script setup lang="ts">
defineProps<{
  favorited: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    class="h-[34px] w-[34px] flex-none rounded-[12px] text-[15px] transition-transform duration-[120ms] active:translate-y-[2px]"
    :style="
      favorited
        ? { backgroundColor: 'rgba(15,137,201,.14)', color: '#0f89c9' }
        : { backgroundColor: '#f1f6f9', color: '#a8bfca', boxShadow: '0 2px 0 rgba(16,40,55,.07)' }
    "
    :aria-pressed="favorited"
    data-testid="favorite-button"
    @click="$emit('click')"
  >
    {{ favorited ? '★' : '☆' }}
  </button>
</template>
