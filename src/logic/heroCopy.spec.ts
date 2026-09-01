import { describe, expect, it } from 'vitest'
import { heroCopy } from './heroCopy'
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
    DestinationStationName: { Zh_tw: '象山', En: 'Xiangshan' },
    FirstTrainTime: '06:00',
    LastTrainTime: '23:50',
    ServiceDay: everyDay,
    ...overrides,
  }
}

describe('heroCopy', () => {
  it('returns the tier copy as-is when the featured direction hasn’t departed', () => {
    const now = new Date(2026, 7, 31, 23, 0)
    const featured = makeEntry({ LastTrainTime: '23:30' }) // 30 min away -> calm

    expect(heroCopy([featured], featured, now, 'zh')).toBe('慢慢走就好，別跑。')
    expect(heroCopy([featured], featured, now, 'en')).toBe('Plenty of time. Enjoy the night air.')
  })

  it('says the specific direction departed when other directions are still live', () => {
    const now = new Date(2026, 7, 31, 23, 0)
    const departed = makeEntry({ TripHeadSign: '往象山', LastTrainTime: '22:50' }) // gone
    const stillLive = makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '23:30' }) // still live

    expect(heroCopy([departed, stillLive], departed, now, 'zh')).toBe('往象山今晚收班了。')
    expect(heroCopy([departed, stillLive], departed, now, 'en')).toBe('This direction is done for tonight.')
  })

  it('says the whole night is done when every direction has departed', () => {
    const now = new Date(2026, 7, 31, 23, 0)
    const departed = makeEntry({ TripHeadSign: '往象山', LastTrainTime: '22:50' })
    const alsoDeparted = makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '22:00' })

    expect(heroCopy([departed, alsoDeparted], departed, now, 'zh')).toBe('今晚的捷運先睡了。')
    expect(heroCopy([departed, alsoDeparted], departed, now, 'en')).toBe('The metro has gone to bed.')
  })

  it('is not fooled by another direction that departed even more recently than the featured one', () => {
    const now = new Date(2026, 7, 31, 23, 0)
    const featured = makeEntry({ TripHeadSign: '往象山', LastTrainTime: '22:00' }) // long gone
    const alsoGone = makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '22:50' }) // also gone, just later

    expect(heroCopy([featured, alsoGone], featured, now, 'zh')).toBe('今晚的捷運先睡了。')
  })
})
