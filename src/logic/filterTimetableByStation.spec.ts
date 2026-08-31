import { describe, expect, it } from 'vitest'
import { filterTimetableByStation } from './filterTimetableByStation'
import type { FirstLastTimetable, ServiceDay } from './types'

const weekday: ServiceDay = {
  Monday: true,
  Tuesday: true,
  Wednesday: true,
  Thursday: true,
  Friday: true,
  Saturday: false,
  Sunday: false,
  NationalHolidays: false,
}

const weekend: ServiceDay = {
  Monday: false,
  Tuesday: false,
  Wednesday: false,
  Thursday: false,
  Friday: false,
  Saturday: true,
  Sunday: true,
  NationalHolidays: true,
}

const fixture: FirstLastTimetable[] = [
  {
    LineID: 'R',
    StationID: 'R05',
    StationName: { Zh_tw: '大安' },
    TripHeadSign: '往象山',
    DestinationStaionID: 'R02',
    DestinationStationName: { Zh_tw: '象山' },
    FirstTrainTime: '06:00',
    LastTrainTime: '24:00',
    ServiceDay: weekday,
  },
  {
    LineID: 'R',
    StationID: 'R05',
    StationName: { Zh_tw: '大安' },
    TripHeadSign: '往淡水',
    DestinationStaionID: 'R28',
    DestinationStationName: { Zh_tw: '淡水' },
    FirstTrainTime: '06:10',
    LastTrainTime: '23:50',
    ServiceDay: weekend,
  },
  {
    LineID: 'R',
    StationID: 'R06',
    StationName: { Zh_tw: '信義安和' },
    TripHeadSign: '往象山',
    DestinationStaionID: 'R02',
    DestinationStationName: { Zh_tw: '象山' },
    FirstTrainTime: '06:02',
    LastTrainTime: '24:02',
    ServiceDay: weekday,
  },
]

describe('filterTimetableByStation', () => {
  it('returns all timetable entries (both directions/service days) for the given station', () => {
    const result = filterTimetableByStation(fixture, 'R05')

    expect(result).toEqual([fixture[0], fixture[1]])
  })

  it('returns an empty array when the station has no matching entry', () => {
    const result = filterTimetableByStation(fixture, 'NOT_A_STATION')

    expect(result).toEqual([])
  })

  it('returns an empty array when given an empty timetable list', () => {
    const result = filterTimetableByStation([], 'R05')

    expect(result).toEqual([])
  })
})
