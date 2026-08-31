<script setup lang="ts">
import { computed } from 'vue'
import PressableButton from './PressableButton.vue'
import type { Lang } from '../composables/useLanguage'
import type { Line } from '../logic/types'

const props = defineProps<{
  line: Line
  lang: Lang
}>()

const name = computed(() => (props.lang === 'en' ? props.line.LineName.En : undefined) ?? props.line.LineName.Zh_tw)
</script>

<template>
  <PressableButton>
    <span
      class="mb-[10px] flex h-[34px] w-[34px] items-center justify-center rounded-[12px] text-[13px] font-black text-white"
      data-testid="line-badge"
      :style="{ backgroundColor: line.LineColor }"
    >
      {{ line.LineNo ?? line.LineID }}
    </span>
    <span class="block text-[15.5px] font-black text-[#16222b]">
      {{ name }}
    </span>
  </PressableButton>
</template>
