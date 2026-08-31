<script setup lang="ts">
import { computed } from 'vue'
import PressableButton from './PressableButton.vue'
import type { Lang } from '../composables/useLanguage'
import type { Station } from '../logic/types'

const props = defineProps<{
  station: Station
  lineColor: string
  lang: Lang
}>()

const name = computed(
  () => (props.lang === 'en' ? props.station.StationName.En : undefined) ?? props.station.StationName.Zh_tw,
)
</script>

<template>
  <PressableButton variant="row">
    <span class="flex items-center gap-[12px]">
      <span
        class="h-[11px] w-[11px] flex-none rounded-[9px] border-[3px] bg-white"
        data-testid="platform-dot"
        :style="{ borderColor: lineColor }"
      />
      <span class="text-[15.5px] font-extrabold text-[#16222b]">
        {{ name }}
      </span>
    </span>
  </PressableButton>
</template>
