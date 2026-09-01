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

    toggleFavorite('R', 'R05', 'R02')

    expect(favorites.value).toEqual([{ lineId: 'R', stationId: 'R05', destinationStationId: 'R02' }])
  })

  it('toggleFavorite removes the entry when already favorited', () => {
    const { toggleFavorite, favorites } = useFavorites()
    toggleFavorite('R', 'R05', 'R02')

    toggleFavorite('R', 'R05', 'R02')

    expect(favorites.value).toEqual([])
  })

  it('isFavorited reflects the current state', () => {
    const { toggleFavorite, isFavorited } = useFavorites()

    expect(isFavorited('R', 'R05', 'R02')).toBe(false)
    toggleFavorite('R', 'R05', 'R02')
    expect(isFavorited('R', 'R05', 'R02')).toBe(true)
  })

  it('treats the same station with a different destination as a separate favorite', () => {
    const { toggleFavorite, favorites } = useFavorites()

    toggleFavorite('R', 'R05', 'R02')
    toggleFavorite('R', 'R05', 'R28')

    expect(favorites.value).toHaveLength(2)
  })

  it('persists toggles to localStorage', () => {
    const { toggleFavorite } = useFavorites()

    toggleFavorite('R', 'R05', 'R02')

    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([
      { lineId: 'R', stationId: 'R05', destinationStationId: 'R02' },
    ])
  })

  it('shares state across every call — it’s a single shared store', () => {
    const a = useFavorites()
    const b = useFavorites()

    a.toggleFavorite('R', 'R05', 'R02')

    expect(b.favorites.value).toEqual([{ lineId: 'R', stationId: 'R05', destinationStationId: 'R02' }])
  })

  it('removeFavorite removes just the matching entry', () => {
    const { toggleFavorite, removeFavorite, favorites } = useFavorites()
    toggleFavorite('R', 'R05', 'R02')
    toggleFavorite('R', 'R05', 'R28')

    removeFavorite('R', 'R05', 'R02')

    expect(favorites.value).toEqual([{ lineId: 'R', stationId: 'R05', destinationStationId: 'R28' }])
  })

  it('pruneInvalid keeps only entries for which isValid returns true, and persists the result', () => {
    const { toggleFavorite, pruneInvalid, favorites } = useFavorites()
    toggleFavorite('R', 'R05', 'R02')
    toggleFavorite('R', 'R99', 'R28')

    pruneInvalid((entry) => entry.stationId === 'R05')

    expect(favorites.value).toEqual([{ lineId: 'R', stationId: 'R05', destinationStationId: 'R02' }])
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([
      { lineId: 'R', stationId: 'R05', destinationStationId: 'R02' },
    ])
  })

  describe('loading from localStorage on startup', () => {
    afterEach(() => {
      localStorage.clear()
    })

    it('hydrates favorites already stored in localStorage', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([{ lineId: 'R', stationId: 'R05', destinationStationId: 'R02' }]))

      vi.resetModules()
      const { useFavorites: freshUseFavorites } = await import('./useFavorites')

      expect(freshUseFavorites().favorites.value).toEqual([
        { lineId: 'R', stationId: 'R05', destinationStationId: 'R02' },
      ])
    })

    it('falls back to an empty list when localStorage holds malformed data', async () => {
      localStorage.setItem(STORAGE_KEY, 'not valid json{{{')

      vi.resetModules()
      const { useFavorites: freshUseFavorites } = await import('./useFavorites')

      expect(freshUseFavorites().favorites.value).toEqual([])
    })
  })
})
