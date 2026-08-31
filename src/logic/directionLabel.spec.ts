import { describe, expect, it } from 'vitest'
import { directionLabel } from './directionLabel'
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

const entry: FirstLastTimetable = {
  LineID: 'R',
  StationID: 'R05',
  StationName: { Zh_tw: '大安' },
  TripHeadSign: '往象山',
  DestinationStaionID: 'R02',
  DestinationStationName: { Zh_tw: '象山', En: 'Xiangshan' },
  FirstTrainTime: '06:00',
  LastTrainTime: '23:50',
  ServiceDay: everyDay,
}

describe('directionLabel', () => {
  it('returns the raw TripHeadSign in Chinese', () => {
    expect(directionLabel(entry, 'zh')).toBe('往象山')
  })

  it('returns "to <English destination name>" in English', () => {
    expect(directionLabel(entry, 'en')).toBe('to Xiangshan')
  })
})
