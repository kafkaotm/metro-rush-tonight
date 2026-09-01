import { ref } from 'vue'

export interface FavoriteEntry {
  lineId: string
  stationId: string
  direction: string
}

const STORAGE_KEY = 'mrt.favs'

function isFavoriteEntry(value: unknown): value is FavoriteEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as FavoriteEntry).lineId === 'string' &&
    typeof (value as FavoriteEntry).stationId === 'string' &&
    typeof (value as FavoriteEntry).direction === 'string'
  )
}

function readFromStorage(): FavoriteEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isFavoriteEntry)
  } catch {
    return []
  }
}

const favorites = ref<FavoriteEntry[]>(readFromStorage())

function persist(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
}

function isSameEntry(a: FavoriteEntry, b: FavoriteEntry): boolean {
  return a.lineId === b.lineId && a.stationId === b.stationId && a.direction === b.direction
}

export function useFavorites() {
  function isFavorited(lineId: string, stationId: string, direction: string): boolean {
    return favorites.value.some((entry) => isSameEntry(entry, { lineId, stationId, direction }))
  }

  function toggleFavorite(lineId: string, stationId: string, direction: string): void {
    const target = { lineId, stationId, direction }
    favorites.value = isFavorited(lineId, stationId, direction)
      ? favorites.value.filter((entry) => !isSameEntry(entry, target))
      : [...favorites.value, target]
    persist()
  }

  return { favorites, isFavorited, toggleFavorite }
}
