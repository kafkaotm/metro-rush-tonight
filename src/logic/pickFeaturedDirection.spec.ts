import { describe, expect, it } from 'vitest'
import { pickFeaturedDirection } from './pickFeaturedDirection'
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

describe('pickFeaturedDirection', () => {
  it('picks the soonest upcoming direction when more than one is still catchable', () => {
    const now = new Date(2026, 7, 31, 23, 0) // 23:00
    const soon = makeEntry({ TripHeadSign: '往象山', LastTrainTime: '23:20' }) // 20 min away
    const later = makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '23:45' }) // 45 min away

    const result = pickFeaturedDirection([later, soon], now)

    expect(result).toEqual({ entry: soon, mins: 20 })
  })

  it('picks the most recently departed direction when every last train has already gone', () => {
    const now = new Date(2026, 8, 1, 1, 0) // 01:00
    const longGone = makeEntry({ TripHeadSign: '往象山', LastTrainTime: '00:00' }) // 60 min ago
    const justMissed = makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '00:50' }) // 10 min ago

    const result = pickFeaturedDirection([longGone, justMissed], now)

    expect(result).toEqual({ entry: justMissed, mins: -10 })
  })

  it('returns null when given an empty list', () => {
    const result = pickFeaturedDirection([], new Date(2026, 7, 31, 23, 0))

    expect(result).toBeNull()
  })
})
