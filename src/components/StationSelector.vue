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
      v-for="station in stations"
      :key="station.StationID"
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
