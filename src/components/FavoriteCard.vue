<script setup lang="ts">
import { computed } from 'vue'
import type { Lang } from '../composables/useLanguage'
import { directionLabel } from '../logic/directionLabel'
import { minutesUntil } from '../logic/minutesUntil'
import type { ResolvedFavorite } from '../logic/resolveFavorite'
import { getTier, TIER_STYLES } from '../logic/tier'
import { t } from '../i18n/translations'

const props = defineProps<{
  resolved: ResolvedFavorite
  now: Date
  lang: Lang
  editing: boolean
}>()

defineEmits<{
  select: []
  remove: []
}>()

const mins = computed(() => minutesUntil(props.resolved.entry.LastTrainTime, props.now))
const tier = computed(() => getTier(mins.value))
const isLive = computed(() => mins.value >= 0)
const isPanic = computed(() => tier.value === 'panic')

const stationName = computed(
  () => (props.lang === 'en' ? props.resolved.stationName.En : undefined) ?? props.resolved.stationName.Zh_tw,
)
const lineName = computed(
  () => (props.lang === 'en' ? props.resolved.lineName.En : undefined) ?? props.resolved.lineName.Zh_tw,
)
const direction = computed(() => directionLabel(props.resolved.entry, props.lang))
</script>

<template>
  <div
    class="relative w-full cursor-pointer rounded-[18px] p-[14px_15px] text-left shadow-[0_3px_0_rgba(16,40,55,.1),inset_0_1px_0_#fff] transition-[transform,background-color,box-shadow] duration-[130ms] [transition-timing-function:ease] hover:bg-[#f1f2f3] active:translate-y-[3px] active:bg-[#e4e5e6] active:shadow-[inset_0_3px_7px_rgba(16,40,55,.18)]"
    :style="{ backgroundColor: isPanic ? '#fde3df' : '#fff' }"
    role="button"
    tabindex="0"
    @click="$emit('select')"
    @keydown.enter="$emit('select')"
  >
    <div class="flex items-center gap-[9px]">
      <span
        class="h-[38px] w-[5px] flex-none rounded-[6px]"
        :style="{ backgroundColor: resolved.lineColor }"
      />
      <div class="min-w-0 flex-1">
        <div class="truncate text-[15.5px] font-black text-[#16222b]">
          {{ stationName }}
        </div>
        <div class="truncate text-[11.5px] font-bold text-[#6b8998]">
          {{ direction }} · {{ lineName }}
        </div>
      </div>
      <div class="flex-none text-right">
        <div
          class="text-[24px] font-black tabular-nums"
          :style="{ color: TIER_STYLES[tier].color }"
          data-testid="favorite-countdown"
        >
          {{ isLive ? mins : '—' }}
        </div>
        <div class="text-[10.5px] font-extrabold text-[#8aa4b1]">
          {{ isLive ? `${resolved.entry.LastTrainTime} 開` : t(lang, 'favDeparted') }}
        </div>
      </div>
      <button
        v-if="editing"
        type="button"
        class="ml-[6px] h-[26px] w-[26px] flex-none rounded-[9px] bg-[rgba(217,68,54,.12)] text-[13px] font-black text-[#d94436]"
        data-testid="favorite-remove"
        @click.stop="$emit('remove')"
      >
        ×
      </button>
    </div>
  </div>
</template>
