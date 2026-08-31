<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../components/BackButton.vue'
import StationSelector from '../components/StationSelector.vue'
import linesData from '../data/lines.json'
import stationsOfLineData from '../data/stationsOfLine.json'
import { filterStationsByLine } from '../logic/filterStationsByLine'
import type { Line, StationOfLine } from '../logic/types'

const props = defineProps<{
  lineId: string
}>()

const lines = linesData as Line[]
const stationsOfLine = stationsOfLineData as StationOfLine[]
const router = useRouter()

const line = computed(() => lines.find((candidate) => candidate.LineID === props.lineId))
const stations = computed(() => filterStationsByLine(stationsOfLine, props.lineId))

function handleSelectStation(stationId: string) {
  router.push(`/lines/${props.lineId}/stations/${stationId}`)
}
</script>

<template>
  <template v-if="line">
    <BackButton
      label="換一條線"
      @click="router.push('/')"
    />
    <div class="mt-[16px]">
      <StationSelector
        :stations="stations"
        :line-color="line.LineColor"
        @select="handleSelectStation"
      />
    </div>
  </template>
</template>
