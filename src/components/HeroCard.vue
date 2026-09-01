<script setup lang="ts">
import { computed } from 'vue'
import type { Lang } from '../composables/useLanguage'
import { directionLabel } from '../logic/directionLabel'
import { heroCopy } from '../logic/heroCopy'
import { minutesUntil } from '../logic/minutesUntil'
import { pickFeaturedDirection } from '../logic/pickFeaturedDirection'
import { getTier, TIER_STYLES } from '../logic/tier'
import type { FirstLastTimetable, Station } from '../logic/types'
import { t } from '../i18n/translations'

const props = defineProps<{
  station: Station
  lineColor: string
  timetable: FirstLastTimetable[]
  now: Date
  lang: Lang
  specifiedDirection?: string
}>()

const pinnedEntry = computed(
  () => props.timetable.find((entry) => entry.TripHeadSign === props.specifiedDirection) ?? null,
)
const isPinned = computed(() => pinnedEntry.value !== null)
const isSingleDirection = computed(() => props.timetable.length === 1)

const stationName = computed(
  () => (props.lang === 'en' ? props.station.StationName.En : undefined) ?? props.station.StationName.Zh_tw,
)

const shown = computed(() => pinnedEntry.value ?? pickFeaturedDirection(props.timetable, props.now)?.entry ?? null)
const mins = computed(() => (shown.value ? minutesUntil(shown.value.LastTrainTime, props.now) : null))
const tier = computed(() => (mins.value !== null ? getTier(mins.value) : null))
const styles = computed(() => (tier.value ? TIER_STYLES[tier.value] : null))
const isLive = computed(() => mins.value !== null && mins.value >= 0)

const heroLabel = computed(() => {
  if (!shown.value) return ''
  if (isPinned.value) return directionLabel(shown.value, props.lang)
  if (isLive.value) return isSingleDirection.value ? directionLabel(shown.value, props.lang) : t(props.lang, 'soonest')
  return t(props.lang, 'allDone')
})

const heroSub = computed(() => {
  if (!shown.value) return ''
  const omitDirection = isPinned.value || isSingleDirection.value
  const time = shown.value.LastTrainTime
  if (omitDirection) {
    return props.lang === 'en' ? `departs ${time}` : `${time} 開`
  }
  const direction = directionLabel(shown.value, props.lang)
  return props.lang === 'en' ? `departs ${time} · ${direction}` : `${time} 開 · ${direction}`
})

const copy = computed(() => (shown.value ? heroCopy(props.timetable, shown.value, props.now, props.lang) : ''))

const countdownAnimation = computed(() => {
  if (tier.value === 'panic') return 'animate-[mrt-pulse_0.9s_ease-in-out_infinite]'
  if (tier.value === 'run') return 'animate-[mrt-breathe_2.4s_ease-in-out_infinite]'
  return ''
})
</script>

<template>
  <div
    v-if="shown && styles"
    class="mt-[14px] rounded-[26px] p-[22px_20px_20px] shadow-[0_10px_24px_rgba(16,40,55,.1)]"
    data-testid="hero-card"
    :style="{ backgroundColor: styles.bg }"
  >
    <div class="flex items-center gap-[8px]">
      <span
        class="h-[10px] w-[10px] flex-none rounded-[9px]"
        :style="{ backgroundColor: lineColor }"
      />
      <span class="text-[17px] font-black text-[#16222b]">{{ stationName }}</span>
    </div>

    <div class="mt-[11px] flex items-center gap-[7px]">
      <span
        class="text-[12.5px] font-extrabold text-[#6b8998]"
        data-testid="hero-label"
      >{{ heroLabel }}</span>
      <span
        v-if="isPinned"
        class="rounded-[6px] bg-[rgba(15,137,201,.12)] px-[6px] py-[2px] text-[9.5px] font-black tracking-[.4px] text-[#0f89c9]"
        data-testid="from-home-badge"
      >
        {{ t(lang, 'fromHome') }}
      </span>
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
        {{ mins }}
      </div>
      <div class="pb-[9px]">
        <div
          class="text-[15px] font-black"
          :style="{ color: styles.color }"
        >
          min
        </div>
        <div class="text-[11.5px] font-bold text-[#6b8998]">
          {{ heroSub }}
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
        {{ shown.LastTrainTime }}
      </div>
      <div class="rounded-[9px] bg-[rgba(107,137,152,.14)] px-[9px] py-[5px] text-[12.5px] font-extrabold text-[#6b8998]">
        {{ t(lang, 'departed') }}
      </div>
    </div>

    <div class="mt-[12px] text-[15px] leading-[1.4] font-black text-[#16222b]">
      {{ copy }}
    </div>
  </div>
</template>
