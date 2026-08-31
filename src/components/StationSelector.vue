<script setup lang="ts">
import StationButton from './StationButton.vue'
import type { Station } from '../logic/types'

defineProps<{
  stations: Station[]
  lineColor: string
}>()

const emit = defineEmits<{
  select: [stationId: string]
}>()
</script>

<template>
  <ul class="m-0 flex list-none flex-col gap-[8px] p-0">
    <li
      v-for="(station, index) in stations"
      :key="station.StationID"
      class="animate-[mrt-in_0.34s_ease_both]"
      :style="{ animationDelay: `${index * 0.03}s` }"
    >
      <StationButton
        :station="station"
        :line-color="lineColor"
        data-testid="station-option"
        @click="emit('select', station.StationID)"
      />
    </li>
  </ul>
</template>
