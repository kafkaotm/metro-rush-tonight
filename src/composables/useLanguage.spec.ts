import { beforeEach, describe, expect, it } from 'vitest'
import { useLanguage } from './useLanguage'

describe('useLanguage', () => {
  beforeEach(() => {
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
})
