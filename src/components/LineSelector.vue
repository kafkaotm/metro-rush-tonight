<script setup lang="ts">
import LineButton from './LineButton.vue'
import type { Line } from '../logic/types'

defineProps<{
  lines: Line[]
}>()

const emit = defineEmits<{
  select: [lineId: string]
}>()
</script>

<template>
  <ul class="m-0 grid list-none grid-cols-2 gap-[12px] p-0">
    <li
      v-for="line in lines"
      :key="line.LineID"
    >
      <LineButton
        :line="line"
        data-testid="line-option"
        @click="emit('select', line.LineID)"
      />
    </li>
  </ul>
</template>
