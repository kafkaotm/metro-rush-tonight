<script setup lang="ts">
import { computed } from 'vue'
import { summarizeDirections } from '../logic/summarizeDirections'
import { TIER_STYLES } from '../logic/tier'
import type { FirstLastTimetable } from '../logic/types'

const props = defineProps<{
  directions: FirstLastTimetable[]
  now: Date
}>()

const summaries = computed(() => summarizeDirections(props.directions, props.now))
</script>

<template>
  <div v-if="summaries.length > 0">
    <div class="mt-[18px] mb-[8px] text-[11.5px] font-extrabold tracking-[.5px] text-[#5d7c8c]">
      各方向末班車
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
          {{ summary.entry.TripHeadSign }}
        </div>
        <div class="ml-auto text-right">
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
      </div>
    </div>
  </div>
</template>
