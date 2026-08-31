<script setup lang="ts">
import { ref } from 'vue'
import LineSelector from './components/LineSelector.vue'
import linesData from './data/lines.json'
import type { Line } from './logic/types'

const lines = linesData as Line[]
const selectedLineId = ref<string | null>(null)

function handleSelectLine(lineId: string) {
  selectedLineId.value = lineId
}
</script>

<template>
  <main>
    <h1>臺北捷運首末班車查詢</h1>
    <LineSelector
      :lines="lines"
      @select="handleSelectLine"
    />
    <p v-if="selectedLineId">
      已選路線：{{ selectedLineId }}
    </p>
  </main>
</template>
