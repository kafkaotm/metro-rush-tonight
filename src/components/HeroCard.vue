<script setup lang="ts">
import { computed } from 'vue'
import { pickFeaturedDirection } from '../logic/pickFeaturedDirection'
import { getTier, TIER_STYLES } from '../logic/tier'
import type { FirstLastTimetable, Station } from '../logic/types'

const props = defineProps<{
  station: Station
  lineColor: string
  timetable: FirstLastTimetable[]
  now: Date
}>()

const featured = computed(() => pickFeaturedDirection(props.timetable, props.now))
const tier = computed(() => (featured.value ? getTier(featured.value.mins) : null))
const styles = computed(() => (tier.value ? TIER_STYLES[tier.value] : null))
const isLive = computed(() => (featured.value ? featured.value.mins >= 0 : false))
const heroLabel = computed(() => (isLive.value ? '最近一班末班車' : '各方向都收班了'))

const countdownAnimation = computed(() => {
  if (tier.value === 'panic') return 'animate-[mrt-pulse_0.9s_ease-in-out_infinite]'
  if (tier.value === 'run') return 'animate-[mrt-breathe_2.4s_ease-in-out_infinite]'
  return ''
})
</script>

<template>
  <div
    v-if="featured && styles"
    class="mt-[14px] rounded-[26px] p-[22px_20px_20px] shadow-[0_10px_24px_rgba(16,40,55,.1)]"
    data-testid="hero-card"
    :style="{ backgroundColor: styles.bg }"
  >
    <div class="flex items-center gap-[8px]">
      <span
        class="h-[10px] w-[10px] flex-none rounded-[9px]"
        :style="{ backgroundColor: lineColor }"
      />
      <span class="text-[17px] font-black text-[#16222b]">{{ station.StationName.Zh_tw }}</span>
    </div>

    <div class="mt-[11px] flex items-center gap-[7px]">
      <span
        class="text-[12.5px] font-extrabold text-[#6b8998]"
        data-testid="hero-label"
      >{{ heroLabel }}</span>
    </div>

    <div
      v-if="isLive"
      class="mt-[4px] flex items-end gap-[8px]"
    >
      <div
        :class="countdownAnimation"
        class="text-[88px] leading-[.86] font-black tracking-[-4px] tabular-nums"
        :style="{ color: styles.color }"
        data-testid="countdown"
      >
        {{ featured.mins }}
      </div>
      <div class="pb-[9px]">
        <div
          class="text-[15px] font-black"
          :style="{ color: styles.color }"
        >
          min
        </div>
        <div class="text-[11.5px] font-bold text-[#6b8998]">
          {{ featured.entry.LastTrainTime }} 開 · {{ featured.entry.TripHeadSign }}
        </div>
      </div>
    </div>

    <div
      v-else
      class="mt-[14px] flex items-baseline gap-[10px]"
    >
      <div
        class="text-[44px] leading-none font-black tracking-[-1.5px] text-[#8aa4b1] tabular-nums line-through decoration-[3px]"
        data-testid="departed-time"
      >
        {{ featured.entry.LastTrainTime }}
      </div>
      <div
        class="rounded-[9px] bg-[rgba(107,137,152,.14)] px-[9px] py-[5px] text-[12.5px] font-extrabold text-[#6b8998]"
      >
        末班車已離站
      </div>
    </div>

    <div class="mt-[12px] text-[15px] leading-[1.4] font-black text-[#16222b]">
      {{ styles.copy }}
    </div>
  </div>
</template>
