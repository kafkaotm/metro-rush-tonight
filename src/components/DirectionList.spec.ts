import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DirectionList from './DirectionList.vue'
import type { FirstLastTimetable, ServiceDay } from '../logic/types'

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

describe('DirectionList', () => {
  it('renders each direction’s heading and last train time, in order', () => {
    const now = new Date(2026, 7, 31, 23, 0)
    const directions = [
      makeEntry({ TripHeadSign: '往象山', LastTrainTime: '23:12' }),
      makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '23:45' }),
    ]

    const wrapper = mount(DirectionList, { props: { directions, now } })

    const rows = wrapper.findAll('[data-testid="direction-row"]')
    expect(rows.map((r) => r.text())).toEqual([
      expect.stringContaining('往象山'),
      expect.stringContaining('往淡水'),
    ])
    expect(rows[0].text()).toContain('23:12')
    expect(rows[1].text()).toContain('23:45')
  })

  it('shows "+N min" for a still-catchable direction and "已過站" for a departed one', () => {
    const now = new Date(2026, 7, 31, 23, 0)
    const directions = [
      makeEntry({ TripHeadSign: '往象山', LastTrainTime: '23:12' }), // +12 min
      makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '22:50' }), // departed
    ]

    const wrapper = mount(DirectionList, { props: { directions, now } })

    const rows = wrapper.findAll('[data-testid="direction-row"]')
    expect(rows[0].text()).toContain('+12 min')
    expect(rows[1].text()).toContain('已過站')
  })

  it('colors each row’s bar with that direction’s own tier color', () => {
    const now = new Date(2026, 7, 31, 23, 0)
    const directions = [
      makeEntry({ TripHeadSign: '往象山', LastTrainTime: '23:03' }), // 3 min -> panic -> #d94436
      makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '23:45' }), // 45 min -> calm -> #0f89c9
    ]

    const wrapper = mount(DirectionList, { props: { directions, now } })

    const bars = wrapper.findAll('[data-testid="direction-bar"]')
    expect(bars[0].attributes('style')).toContain('background-color: rgb(217, 68, 54)')
    expect(bars[1].attributes('style')).toContain('background-color: rgb(15, 137, 201)')
  })

  it('renders no rows when given an empty list', () => {
    const wrapper = mount(DirectionList, { props: { directions: [], now: new Date(2026, 7, 31, 23, 0) } })

    expect(wrapper.findAll('[data-testid="direction-row"]')).toHaveLength(0)
  })
})
