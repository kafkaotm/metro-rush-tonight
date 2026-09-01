import { describe, expect, it } from 'vitest'
import { resolveFavorite } from './resolveFavorite'
import type { FirstLastTimetable, Line, ServiceDay } from './types'

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

const lines: Line[] = [
  {
    LineID: 'R',
    LineName: { Zh_tw: '淡水信義線', En: 'Tamsui-Xinyi Line' },
    LineSectionName: {},
    LineColor: '#d90023',
    LineNo: 'R',
    IsBranch: false,
    VersionID: 2,
    SrcUpdateTime: '',
    UpdateTime: '',
  },
]

const timetable: FirstLastTimetable[] = [
  {
    LineID: 'R',
    StationID: 'R05',
    StationName: { Zh_tw: '大安', En: 'Daan' },
    TripHeadSign: '往象山',
    DestinationStaionID: 'R02',
    DestinationStationName: { Zh_tw: '象山', En: 'Xiangshan' },
    FirstTrainTime: '06:00',
    LastTrainTime: '23:50',
    ServiceDay: everyDay,
  },
]

describe('resolveFavorite', () => {
  it('resolves a valid favorite into its display data', () => {
    const result = resolveFavorite({ lineId: 'R', stationId: 'R05', destinationStationId: 'R02' }, lines, timetable)

    expect(result).toEqual({
      favorite: { lineId: 'R', stationId: 'R05', destinationStationId: 'R02' },
      stationName: { Zh_tw: '大安', En: 'Daan' },
      lineName: { Zh_tw: '淡水信義線', En: 'Tamsui-Xinyi Line' },
      lineColor: '#d90023',
      entry: timetable[0],
    })
  })

  it('returns null when the line no longer exists', () => {
    const result = resolveFavorite({ lineId: 'ZZ', stationId: 'R05', destinationStationId: 'R02' }, lines, timetable)

    expect(result).toBeNull()
  })

  it('returns null when the station no longer exists on that line', () => {
    const result = resolveFavorite({ lineId: 'R', stationId: 'R99', destinationStationId: 'R02' }, lines, timetable)

    expect(result).toBeNull()
  })

  it('returns null when the destination no longer exists at that station', () => {
    const result = resolveFavorite({ lineId: 'R', stationId: 'R05', destinationStationId: 'R28' }, lines, timetable)

    expect(result).toBeNull()
  })
})
