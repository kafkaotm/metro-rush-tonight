<script setup lang="ts">
import PressableButton from './PressableButton.vue'
import type { Station } from '../logic/types'

defineProps<{
  station: Station
  lineColor: string
}>()
</script>

<template>
  <PressableButton variant="row">
    <span class="flex items-center gap-[12px]">
      <span
        class="h-[11px] w-[11px] flex-none rounded-[9px] border-[3px] bg-white"
        data-testid="platform-dot"
        :style="{ borderColor: lineColor }"
      />
      <span class="text-[15.5px] font-extrabold text-[#16222b]">
        {{ station.StationName.Zh_tw }}
      </span>
    </span>
  </PressableButton>
</template>
