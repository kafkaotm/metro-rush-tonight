import { describe, expect, it } from 'vitest'
import { minutesUntil } from './minutesUntil'

describe('minutesUntil', () => {
  it('returns a positive count of minutes for a time later today', () => {
    const now = new Date(2026, 7, 31, 22, 0) // 22:00
    expect(minutesUntil('23:50', now)).toBe(110)
  })

  it('treats an early-morning time as tonight’s upcoming last train, not this morning’s', () => {
    const now = new Date(2026, 7, 31, 23, 30) // 23:30
    expect(minutesUntil('00:45', now)).toBe(75)
  })

  it('returns a negative count when the time already passed a few minutes ago, just after midnight', () => {
    const now = new Date(2026, 7, 31, 0, 50) // 00:50
    expect(minutesUntil('00:45', now)).toBe(-5)
  })

  it('returns 0 when the time is exactly now', () => {
    const now = new Date(2026, 7, 31, 23, 50)
    expect(minutesUntil('23:50', now)).toBe(0)
  })
})
