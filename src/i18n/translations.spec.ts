import { describe, expect, it } from 'vitest'
import { t, translations } from './translations'

describe('translations', () => {
  it('defines the exact same set of keys for zh and en', () => {
    expect(Object.keys(translations.en).sort()).toEqual(Object.keys(translations.zh).sort())
  })

  it('t() looks up the string for the given language and key', () => {
    expect(t('zh', 'pickLine')).toBe('今晚搭哪條線？')
    expect(t('en', 'pickLine')).toBe('Which line tonight?')
  })
})
