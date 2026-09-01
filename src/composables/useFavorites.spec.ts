import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFavorites } from './useFavorites'

const STORAGE_KEY = 'mrt.favs'

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
    useFavorites().favorites.value = []
  })

  it('starts with no favorites', () => {
    expect(useFavorites().favorites.value).toEqual([])
  })

  it('toggleFavorite adds an entry when not already favorited', () => {
    const { toggleFavorite, favorites } = useFavorites()

    toggleFavorite('R', 'R05', '往象山')

    expect(favorites.value).toEqual([{ lineId: 'R', stationId: 'R05', direction: '往象山' }])
  })

  it('toggleFavorite removes the entry when already favorited', () => {
    const { toggleFavorite, favorites } = useFavorites()
    toggleFavorite('R', 'R05', '往象山')

    toggleFavorite('R', 'R05', '往象山')

    expect(favorites.value).toEqual([])
  })

  it('isFavorited reflects the current state', () => {
    const { toggleFavorite, isFavorited } = useFavorites()

    expect(isFavorited('R', 'R05', '往象山')).toBe(false)
    toggleFavorite('R', 'R05', '往象山')
    expect(isFavorited('R', 'R05', '往象山')).toBe(true)
  })

  it('treats the same station with a different direction as a separate favorite', () => {
    const { toggleFavorite, favorites } = useFavorites()

    toggleFavorite('R', 'R05', '往象山')
    toggleFavorite('R', 'R05', '往淡水')

    expect(favorites.value).toHaveLength(2)
  })

  it('persists toggles to localStorage', () => {
    const { toggleFavorite } = useFavorites()

    toggleFavorite('R', 'R05', '往象山')

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([
      { lineId: 'R', stationId: 'R05', direction: '往象山' },
    ])
  })

  it('shares state across every call — it’s a single shared store', () => {
    const a = useFavorites()
    const b = useFavorites()

    a.toggleFavorite('R', 'R05', '往象山')

    expect(b.favorites.value).toEqual([{ lineId: 'R', stationId: 'R05', direction: '往象山' }])
  })

  it('removeFavorite removes just the matching entry', () => {
    const { toggleFavorite, removeFavorite, favorites } = useFavorites()
    toggleFavorite('R', 'R05', '往象山')
    toggleFavorite('R', 'R05', '往淡水')

    removeFavorite('R', 'R05', '往象山')

    expect(favorites.value).toEqual([{ lineId: 'R', stationId: 'R05', direction: '往淡水' }])
  })

  it('pruneInvalid keeps only entries for which isValid returns true, and persists the result', () => {
    const { toggleFavorite, pruneInvalid, favorites } = useFavorites()
    toggleFavorite('R', 'R05', '往象山')
    toggleFavorite('R', 'R99', '往淡水')

    pruneInvalid((entry) => entry.stationId === 'R05')

    expect(favorites.value).toEqual([{ lineId: 'R', stationId: 'R05', direction: '往象山' }])
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([
      { lineId: 'R', stationId: 'R05', direction: '往象山' },
    ])
  })

  describe('loading from localStorage on startup', () => {
    afterEach(() => {
      localStorage.clear()
    })

    it('hydrates favorites already stored in localStorage', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([{ lineId: 'R', stationId: 'R05', direction: '往象山' }]))

      vi.resetModules()
      const { useFavorites: freshUseFavorites } = await import('./useFavorites')

      expect(freshUseFavorites().favorites.value).toEqual([{ lineId: 'R', stationId: 'R05', direction: '往象山' }])
    })

    it('falls back to an empty list when localStorage holds malformed data', async () => {
      localStorage.setItem(STORAGE_KEY, 'not valid json{{{')

      vi.resetModules()
      const { useFavorites: freshUseFavorites } = await import('./useFavorites')

      expect(freshUseFavorites().favorites.value).toEqual([])
    })
  })
})
