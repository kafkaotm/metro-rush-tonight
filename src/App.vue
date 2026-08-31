<script setup lang="ts">
import { computed, ref } from 'vue'
import LineSelector from './components/LineSelector.vue'
import StationSelector from './components/StationSelector.vue'
import linesData from './data/lines.json'
import stationsOfLineData from './data/stationsOfLine.json'
import { filterStationsByLine } from './logic/filterStationsByLine'
import type { Line, StationOfLine } from './logic/types'

const lines = linesData as Line[]
const stationsOfLine = stationsOfLineData as StationOfLine[]

const selectedLineId = ref<string | null>(null)
const selectedStationId = ref<string | null>(null)

const selectedLine = computed(() => lines.find((line) => line.LineID === selectedLineId.value) ?? null)
const stations = computed(() =>
  selectedLineId.value ? filterStationsByLine(stationsOfLine, selectedLineId.value) : [],
)

function handleSelectLine(lineId: string) {
  selectedLineId.value = lineId
  selectedStationId.value = null
}

function handleSelectStation(stationId: string) {
  selectedStationId.value = stationId
}
</script>

<template>
  <main>
    <h1>臺北捷運首末班車查詢</h1>

    <LineSelector
      v-if="!selectedLine"
      :lines="lines"
      @select="handleSelectLine"
    />

    <StationSelector
      v-else
      :stations="stations"
      :line-color="selectedLine.LineColor"
      @select="handleSelectStation"
    />

    <p v-if="selectedStationId">
      已選站點：{{ selectedStationId }}
    </p>
  </main>
</template>
