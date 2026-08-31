<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../components/BackButton.vue'
import DirectionList from '../components/DirectionList.vue'
import HeroCard from '../components/HeroCard.vue'
import { useLanguage } from '../composables/useLanguage'
import { useNow } from '../composables/useNow'
import linesData from '../data/lines.json'
import stationsOfLineData from '../data/stationsOfLine.json'
import timetableData from '../data/timetable.json'
import { t } from '../i18n/translations'
import { filterStationsByLine } from '../logic/filterStationsByLine'
import { filterTimetableByStation } from '../logic/filterTimetableByStation'
import type { FirstLastTimetable, Line, StationOfLine } from '../logic/types'

const props = defineProps<{
  lineId: string
  stationId: string
}>()

const lines = linesData as Line[]
const stationsOfLine = stationsOfLineData as StationOfLine[]
const timetable = timetableData as FirstLastTimetable[]
const now = useNow()
const router = useRouter()
const { lang } = useLanguage()

const line = computed(() => lines.find((candidate) => candidate.LineID === props.lineId))
const station = computed(() =>
  filterStationsByLine(stationsOfLine, props.lineId).find((candidate) => candidate.StationID === props.stationId),
)
const stationTimetable = computed(() => filterTimetableByStation(timetable, props.stationId))
</script>

<template>
  <div
    v-if="line && station"
    class="animate-[mrt-slide_0.3s_ease_both]"
  >
    <BackButton
      :label="t(lang, 'changeStation')"
      @click="router.push(`/lines/${lineId}`)"
    />
    <HeroCard
      :station="station"
      :line-color="line.LineColor"
      :timetable="stationTimetable"
      :now="now"
      :lang="lang"
    />
    <DirectionList
      :directions="stationTimetable"
      :now="now"
      :lang="lang"
    />
  </div>
</template>
