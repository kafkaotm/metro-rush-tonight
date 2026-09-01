import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLanguage } from './useLanguage'

const STORAGE_KEY = 'mrt.lang'

describe('useLanguage', () => {
  beforeEach(() => {
    localStorage.clear()
    useLanguage().setLang('zh')
  })

  it('defaults to "zh"', () => {
    expect(useLanguage().lang.value).toBe('zh')
  })

  it('shares state across every call — setting the language updates all consumers', () => {
    const a = useLanguage()
    const b = useLanguage()

    a.setLang('en')

    expect(b.lang.value).toBe('en')
  })

  it('persists the choice to localStorage', () => {
    useLanguage().setLang('en')

    expect(localStorage.getItem(STORAGE_KEY)).toBe('en')
  })

  describe('loading from localStorage on startup', () => {
    it('starts with the language already stored in localStorage', async () => {
      localStorage.setItem(STORAGE_KEY, 'en')

      vi.resetModules()
      const { useLanguage: freshUseLanguage } = await import('./useLanguage')

      expect(freshUseLanguage().lang.value).toBe('en')
    })

    it('falls back to "zh" when localStorage holds something other than "zh"/"en"', async () => {
      localStorage.setItem(STORAGE_KEY, 'fr')

      vi.resetModules()
      const { useLanguage: freshUseLanguage } = await import('./useLanguage')

      expect(freshUseLanguage().lang.value).toBe('zh')
    })
  })
})
