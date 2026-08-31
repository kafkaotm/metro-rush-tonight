<script setup lang="ts">
import { useRouter } from 'vue-router'
import LineSelector from '../components/LineSelector.vue'
import { useLanguage } from '../composables/useLanguage'
import linesData from '../data/lines.json'
import { t } from '../i18n/translations'
import type { Line } from '../logic/types'

const lines = linesData as Line[]
const router = useRouter()
const { lang } = useLanguage()

function handleSelectLine(lineId: string) {
  router.push(`/lines/${lineId}`)
}
</script>

<template>
  <h1 class="text-[23px] leading-[1.35] font-black text-[#16222b]">
    {{ t(lang, 'pickLine') }}
  </h1>
  <div class="mt-[16px]">
    <LineSelector
      :lines="lines"
      :lang="lang"
      @select="handleSelectLine"
    />
  </div>
</template>
