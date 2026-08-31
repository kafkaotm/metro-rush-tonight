<script setup lang="ts">
import type { Line } from '../logic/types'

defineProps<{
  lines: Line[]
}>()

const emit = defineEmits<{
  select: [lineId: string]
}>()
</script>

<template>
  <ul class="line-selector">
    <li
      v-for="line in lines"
      :key="line.LineID"
    >
      <button
        type="button"
        data-testid="line-option"
        :style="{ backgroundColor: line.LineColor }"
        @click="emit('select', line.LineID)"
      >
        {{ line.LineName.Zh_tw }}
      </button>
    </li>
  </ul>
</template>
