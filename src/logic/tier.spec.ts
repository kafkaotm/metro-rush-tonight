import { describe, expect, it } from 'vitest'
import { getTier, TIER_STYLES } from './tier'

describe('getTier', () => {
  it('returns "gone" for any negative minutes', () => {
    expect(getTier(-1)).toBe('gone')
    expect(getTier(-100)).toBe('gone')
  })

  it('returns "panic" for 0 up to (but not including) 5 minutes', () => {
    expect(getTier(0)).toBe('panic')
    expect(getTier(4)).toBe('panic')
  })

  it('returns "run" for 5 up to 20 minutes inclusive', () => {
    expect(getTier(5)).toBe('run')
    expect(getTier(20)).toBe('run')
  })

  it('returns "calm" for more than 20 minutes', () => {
    expect(getTier(21)).toBe('calm')
    expect(getTier(999)).toBe('calm')
  })
})

describe('TIER_STYLES', () => {
  it('defines color, bg, and zh/en copy for every tier', () => {
    expect(TIER_STYLES.calm).toEqual({
      color: '#0f89c9',
      bg: '#dff0fb',
      copy: { zh: '慢慢走就好，別跑。', en: 'Plenty of time. Enjoy the night air.' },
    })
    expect(TIER_STYLES.run).toEqual({
      color: '#c98209',
      bg: '#fdf0d8',
      copy: { zh: '跑得動！現在出發還來得及。', en: "Move now and you'll make it." },
    })
    expect(TIER_STYLES.panic).toEqual({
      color: '#d94436',
      bg: '#fde3df',
      copy: { zh: '快跑！別再滑手機了。', en: 'Run. Stop reading this.' },
    })
    expect(TIER_STYLES.gone).toEqual({
      color: '#6b8998',
      bg: '#e6ecef',
      copy: { zh: '今晚的捷運先睡了。', en: 'The metro has gone to bed.' },
    })
  })
})
