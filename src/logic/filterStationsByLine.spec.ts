import { describe, expect, it } from 'vitest'
import { filterStationsByLine } from './filterStationsByLine'
import type { StationOfLine } from './types'

const fixture: StationOfLine[] = [
  {
    LineID: 'BR',
    Stations: [
      { StationID: 'BR01', StationName: { Zh_tw: '動物園', En: 'Taipei Zoo' }, Sequence: 1 },
      { StationID: 'BR02', StationName: { Zh_tw: '木柵', En: 'Muzha' }, Sequence: 2 },
    ],
  },
  {
    LineID: 'R',
    Stations: [
      { StationID: 'R02', StationName: { Zh_tw: '象山', En: 'Xiangshan' }, Sequence: 1 },
      { StationID: 'R03', StationName: { Zh_tw: '台北101/世貿', En: 'Taipei 101/World Trade Center' }, Sequence: 2 },
    ],
  },
]

describe('filterStationsByLine', () => {
  it('returns the stations belonging to the given line, in sequence order', () => {
    const result = filterStationsByLine(fixture, 'BR')

    expect(result).toEqual([
      { StationID: 'BR01', StationName: { Zh_tw: '動物園', En: 'Taipei Zoo' }, Sequence: 1 },
      { StationID: 'BR02', StationName: { Zh_tw: '木柵', En: 'Muzha' }, Sequence: 2 },
    ])
  })

  it('returns an empty array when the line has no matching entry', () => {
    const result = filterStationsByLine(fixture, 'NOT_A_LINE')

    expect(result).toEqual([])
  })

  it('returns an empty array when given an empty line list', () => {
    const result = filterStationsByLine([], 'BR')

    expect(result).toEqual([])
  })
})
