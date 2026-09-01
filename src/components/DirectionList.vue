<script setup lang="ts">
import { computed } from 'vue'
import type { Lang } from '../composables/useLanguage'
import { useFavorites } from '../composables/useFavorites'
import { directionLabel } from '../logic/directionLabel'
import { summarizeDirections } from '../logic/summarizeDirections'
import { TIER_STYLES } from '../logic/tier'
import type { FirstLastTimetable } from '../logic/types'
import { t } from '../i18n/translations'
import FavoriteButton from './FavoriteButton.vue'

const props = defineProps<{
  directions: FirstLastTimetable[]
  now: Date
  lang: Lang
}>()

const { isFavorited, toggleFavorite } = useFavorites()

const summaries = computed(() => summarizeDirections(props.directions, props.now, props.lang))
const hasFavoritedDirection = computed(() =>
  props.directions.some((entry) => isFavorited(entry.LineID, entry.StationID, entry.TripHeadSign ?? '')),
)
const headerLabel = computed(() => t(props.lang, props.directions.length === 1 ? 'oneDirection' : 'allDirections'))
</script>

<template>
  <div v-if="summaries.length > 0">
    <div class="mt-[18px] mb-[8px] text-[11.5px] font-extrabold tracking-[.5px] text-[#5d7c8c]">
      {{ headerLabel }}
    </div>
    <div
      v-if="!hasFavoritedDirection"
      class="mb-[8px] text-[11.5px] font-bold text-[#8aa4b1]"
    >
      {{ t(lang, 'favHint') }}
    </div>
    <div class="flex flex-col gap-[8px]">
      <div
        v-for="summary in summaries"
        :key="summary.entry.TripHeadSign"
        class="flex items-center gap-[12px] rounded-[16px] bg-white p-[14px] shadow-[0_2px_0_rgba(16,40,55,.09)]"
        data-testid="direction-row"
      >
        <span
          class="h-[34px] w-[6px] flex-none rounded-[6px]"
          data-testid="direction-bar"
          :style="{ backgroundColor: TIER_STYLES[summary.tier].color }"
        />
        <div class="text-[14.5px] font-black text-[#16222b]">
          {{ directionLabel(summary.entry, lang) }}
        </div>
        <div class="ml-auto flex items-center gap-[12px]">
          <div class="text-right">
            <div class="text-[20px] font-black tabular-nums text-[#16222b]">
              {{ summary.entry.LastTrainTime }}
            </div>
            <div
              class="text-[11px] font-extrabold"
              :style="{ color: TIER_STYLES[summary.tier].color }"
            >
              {{ summary.gapLabel }}
            </div>
          </div>
          <FavoriteButton
            :favorited="isFavorited(summary.entry.LineID, summary.entry.StationID, summary.entry.TripHeadSign ?? '')"
            @click="toggleFavorite(summary.entry.LineID, summary.entry.StationID, summary.entry.TripHeadSign ?? '')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
