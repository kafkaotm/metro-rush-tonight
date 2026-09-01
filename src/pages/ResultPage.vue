<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
const route = useRoute()
const { lang } = useLanguage()

const line = computed(() => lines.find((candidate) => candidate.LineID === props.lineId))
const station = computed(() =>
  filterStationsByLine(stationsOfLine, props.lineId).find((candidate) => candidate.StationID === props.stationId),
)
const stationTimetable = computed(() => filterTimetableByStation(timetable, props.stationId))

// A ?direction= query param only ever gets set by a favorite card on the
// home page (see LinesPage) — its presence is what "來源" means here. The
// value is a DestinationStaionID, not the display TripHeadSign text.
const specifiedDestinationStationId = computed(() => {
  const value = route.query.direction
  return typeof value === 'string' ? value : undefined
})
const fromHome = computed(() => specifiedDestinationStationId.value !== undefined)

function handleBack() {
  router.push(fromHome.value ? '/' : `/lines/${props.lineId}`)
}
</script>

<template>
  <div
    v-if="line && station"
    class="animate-[mrt-slide_0.3s_ease_both]"
  >
    <BackButton
      :label="t(lang, fromHome ? 'backHome' : 'changeStation')"
      @click="handleBack"
    />
    <HeroCard
      :station="station"
      :line-color="line.LineColor"
      :timetable="stationTimetable"
      :now="now"
      :lang="lang"
      :specified-destination-station-id="specifiedDestinationStationId"
    />
    <DirectionList
      :directions="stationTimetable"
      :now="now"
      :lang="lang"
    />
  </div>
</template>
