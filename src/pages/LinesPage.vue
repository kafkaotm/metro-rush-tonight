<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FavoriteCard from '../components/FavoriteCard.vue'
import LineSelector from '../components/LineSelector.vue'
import { useFavorites } from '../composables/useFavorites'
import type { FavoriteEntry } from '../composables/useFavorites'
import { useLanguage } from '../composables/useLanguage'
import { useNow } from '../composables/useNow'
import linesData from '../data/lines.json'
import timetableData from '../data/timetable.json'
import { t } from '../i18n/translations'
import { resolveFavorite } from '../logic/resolveFavorite'
import type { FirstLastTimetable, Line } from '../logic/types'

const lines = linesData as Line[]
const timetable = timetableData as FirstLastTimetable[]
const router = useRouter()
const { lang } = useLanguage()
const now = useNow()
const { favorites, removeFavorite, pruneInvalid } = useFavorites()

const editing = ref(false)

const resolvedFavorites = computed(() =>
  favorites.value.map((favorite) => resolveFavorite(favorite, lines, timetable)).filter((resolved) => resolved !== null),
)

onMounted(() => {
  pruneInvalid((entry) => resolveFavorite(entry, lines, timetable) !== null)
})

function handleSelectLine(lineId: string) {
  router.push(`/lines/${lineId}`)
}

function handleSelectFavorite(favorite: FavoriteEntry) {
  router.push({
    path: `/lines/${favorite.lineId}/stations/${favorite.stationId}`,
    query: { direction: favorite.destinationStationId },
  })
}

function handleRemoveFavorite(favorite: FavoriteEntry) {
  removeFavorite(favorite.lineId, favorite.stationId, favorite.destinationStationId)
  if (favorites.value.length === 0) {
    editing.value = false
  }
}
</script>

<template>
  <div
    v-if="resolvedFavorites.length > 0"
    class="mb-[18px]"
  >
    <div class="mb-[8px] flex items-baseline justify-between">
      <span class="text-[11.5px] font-extrabold text-[#5d7c8c]">{{ t(lang, 'savedRoutes') }}</span>
      <button
        type="button"
        class="text-[11.5px] font-extrabold text-[#8aa4b1]"
        @click="editing = !editing"
      >
        {{ t(lang, editing ? 'done' : 'edit') }}
      </button>
    </div>
    <div class="flex flex-col gap-[9px]">
      <div
        v-for="resolved in resolvedFavorites"
        :key="`${resolved.favorite.lineId}-${resolved.favorite.stationId}-${resolved.favorite.destinationStationId}`"
        class="animate-[mrt-in_0.34s_ease_both]"
      >
        <FavoriteCard
          :resolved="resolved"
          :now="now"
          :lang="lang"
          :editing="editing"
          @select="handleSelectFavorite(resolved.favorite)"
          @remove="handleRemoveFavorite(resolved.favorite)"
        />
      </div>
    </div>
  </div>

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
