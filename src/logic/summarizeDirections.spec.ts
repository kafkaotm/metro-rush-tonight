import { describe, expect, it } from 'vitest'
import { summarizeDirections } from './summarizeDirections'
import type { FirstLastTimetable, ServiceDay } from './types'

const everyDay: ServiceDay = {
  Monday: true,
  Tuesday: true,
  Wednesday: true,
  Thursday: true,
  Friday: true,
  Saturday: true,
  Sunday: true,
  NationalHolidays: true,
}

function makeEntry(overrides: Partial<FirstLastTimetable> = {}): FirstLastTimetable {
  return {
    LineID: 'R',
    StationID: 'R05',
    StationName: { Zh_tw: '大安' },
    TripHeadSign: '往象山',
    DestinationStaionID: 'R02',
    DestinationStationName: { Zh_tw: '象山' },
    FirstTrainTime: '06:00',
    LastTrainTime: '23:50',
    ServiceDay: everyDay,
    ...overrides,
  }
}

describe('summarizeDirections', () => {
  it('preserves input order and computes mins/tier/gapLabel for a still-catchable direction', () => {
    const now = new Date(2026, 7, 31, 23, 0) // 23:00
    const entries = [makeEntry({ TripHeadSign: '往象山', LastTrainTime: '23:12' })] // 12 min away -> run

    const result = summarizeDirections(entries, now, 'zh')

    expect(result).toEqual([
      { entry: entries[0], mins: 12, tier: 'run', gapLabel: '+12 min' },
    ])
  })

  it('uses the "已過站" / "departed" label for a direction whose last train already left', () => {
    const now = new Date(2026, 8, 1, 0, 0) // 00:00
    const entries = [makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '23:50' })] // 10 min ago -> gone

    expect(summarizeDirections(entries, now, 'zh')).toEqual([
      { entry: entries[0], mins: -10, tier: 'gone', gapLabel: '已過站' },
    ])
    expect(summarizeDirections(entries, now, 'en')).toEqual([
      { entry: entries[0], mins: -10, tier: 'gone', gapLabel: 'departed' },
    ])
  })

  it('summarizes multiple directions independently, each with its own tier', () => {
    const now = new Date(2026, 7, 31, 23, 0) // 23:00
    const soon = makeEntry({ TripHeadSign: '往象山', LastTrainTime: '23:03' }) // 3 min -> panic
    const later = makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '23:45' }) // 45 min -> calm

    const result = summarizeDirections([soon, later], now, 'zh')

    expect(result.map((r) => r.tier)).toEqual(['panic', 'calm'])
  })

  it('returns an empty array when given no entries', () => {
    expect(summarizeDirections([], new Date(2026, 7, 31, 23, 0), 'zh')).toEqual([])
  })
})
