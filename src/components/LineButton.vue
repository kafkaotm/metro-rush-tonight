<script setup lang="ts">
import PressableButton from './PressableButton.vue'
import type { Line } from '../logic/types'

defineProps<{
  line: Line
}>()
</script>

<template>
  <PressableButton>
    <span
      class="mb-[10px] flex h-[34px] w-[34px] items-center justify-center rounded-[12px] text-[13px] font-black text-white"
      data-testid="line-badge"
      :style="{ backgroundColor: line.LineColor }"
    >
      {{ line.LineNo ?? line.LineID }}
    </span>
    <span class="block text-[15.5px] font-black text-[#16222b]">
      {{ line.LineName.Zh_tw }}
    </span>
  </PressableButton>
</template>
