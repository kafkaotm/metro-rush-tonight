<script setup lang="ts">
import { useRouter } from 'vue-router'
import LineSelector from '../components/LineSelector.vue'
import linesData from '../data/lines.json'
import type { Line } from '../logic/types'

const lines = linesData as Line[]
const router = useRouter()

function handleSelectLine(lineId: string) {
  router.push(`/lines/${lineId}`)
}
</script>

<template>
  <h1 class="text-[23px] leading-[1.35] font-black text-[#16222b]">
    今晚搭哪條線？
  </h1>
  <div class="mt-[16px]">
    <LineSelector
      :lines="lines"
      @select="handleSelectLine"
    />
  </div>
</template>
