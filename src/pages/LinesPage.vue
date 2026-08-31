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
  <LineSelector
    :lines="lines"
    @select="handleSelectLine"
  />
</template>
