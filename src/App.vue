<script setup lang="ts">
import { computed, ref } from 'vue'
import DirectionList from './components/DirectionList.vue'
import HeroCard from './components/HeroCard.vue'
import LineSelector from './components/LineSelector.vue'
import StationSelector from './components/StationSelector.vue'
import linesData from './data/lines.json'
import stationsOfLineData from './data/stationsOfLine.json'
import timetableData from './data/timetable.json'
import { filterStationsByLine } from './logic/filterStationsByLine'
import { filterTimetableByStation } from './logic/filterTimetableByStation'
import type { FirstLastTimetable, Line, StationOfLine } from './logic/types'

const lines = linesData as Line[]
const stationsOfLine = stationsOfLineData as StationOfLine[]
const timetable = timetableData as FirstLastTimetable[]

const selectedLineId = ref<string | null>(null)
const selectedStationId = ref<string | null>(null)
const now = ref(new Date())

const selectedLine = computed(() => lines.find((line) => line.LineID === selectedLineId.value) ?? null)
const stations = computed(() =>
  selectedLineId.value ? filterStationsByLine(stationsOfLine, selectedLineId.value) : [],
)
const selectedStation = computed(
  () => stations.value.find((station) => station.StationID === selectedStationId.value) ?? null,
)
const stationTimetable = computed(() =>
  selectedStationId.value ? filterTimetableByStation(timetable, selectedStationId.value) : [],
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
  <main class="mx-auto min-h-screen w-full max-w-[440px] bg-[#eef7fd] px-[18px] py-[18px]">
    <h1>臺北捷運首末班車查詢</h1>

    <LineSelector
      v-if="!selectedLine"
      :lines="lines"
      @select="handleSelectLine"
    />

    <StationSelector
      v-else-if="!selectedStation"
      :stations="stations"
      :line-color="selectedLine.LineColor"
      @select="handleSelectStation"
    />

    <template v-else>
      <HeroCard
        :station="selectedStation"
        :line-color="selectedLine.LineColor"
        :timetable="stationTimetable"
        :now="now"
      />
      <DirectionList
        :directions="stationTimetable"
        :now="now"
      />
    </template>
  </main>
</template>
