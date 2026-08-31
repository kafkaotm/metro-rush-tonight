<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../components/BackButton.vue'
import StationSelector from '../components/StationSelector.vue'
import { useLanguage } from '../composables/useLanguage'
import linesData from '../data/lines.json'
import stationsOfLineData from '../data/stationsOfLine.json'
import { t } from '../i18n/translations'
import { filterStationsByLine } from '../logic/filterStationsByLine'
import type { Line, StationOfLine } from '../logic/types'

const props = defineProps<{
  lineId: string
}>()

const lines = linesData as Line[]
const stationsOfLine = stationsOfLineData as StationOfLine[]
const router = useRouter()
const { lang } = useLanguage()

const line = computed(() => lines.find((candidate) => candidate.LineID === props.lineId))
const stations = computed(() => filterStationsByLine(stationsOfLine, props.lineId))
const lineName = computed(() => (lang.value === 'en' ? line.value?.LineName.En : undefined) ?? line.value?.LineName.Zh_tw)

function handleSelectStation(stationId: string) {
  router.push(`/lines/${props.lineId}/stations/${stationId}`)
}
</script>

<template>
  <div
    v-if="line"
    class="animate-[mrt-slide_0.3s_ease_both]"
  >
    <BackButton
      :label="t(lang, 'changeLine')"
      @click="router.push('/')"
    />
    <div class="mt-[16px] mb-[6px] flex items-center gap-[9px]">
      <span
        class="h-[12px] w-[12px] flex-none rounded-[9px]"
        :style="{ backgroundColor: line.LineColor }"
      />
      <span class="text-[21px] font-black text-[#16222b]">{{ lineName }}</span>
    </div>
    <div class="mb-[14px] text-[12.5px] font-semibold text-[#6b8998]">
      {{ t(lang, 'whichStation') }}
    </div>
    <StationSelector
      :stations="stations"
      :line-color="line.LineColor"
      :lang="lang"
      @select="handleSelectStation"
    />
  </div>
</template>
