import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DirectionList from './DirectionList.vue'
import { useFavorites } from '../composables/useFavorites'
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
    DestinationStationName: { Zh_tw: '象山', En: 'Xiangshan' },
    FirstTrainTime: '06:00',
    LastTrainTime: '23:50',
    ServiceDay: everyDay,
    ...overrides,
  }
}

describe('DirectionList', () => {
  beforeEach(() => {
    localStorage.clear()
    useFavorites().favorites.value = []
  })

  it('renders each direction’s heading and last train time, in order', () => {
    const now = new Date(2026, 7, 31, 23, 0)
    const directions = [
      makeEntry({ TripHeadSign: '往象山', LastTrainTime: '23:12' }),
      makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '23:45' }),
    ]

    const wrapper = mount(DirectionList, { props: { directions, now, lang: 'zh' } })

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

    const wrapper = mount(DirectionList, { props: { directions, now, lang: 'zh' } })

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

    const wrapper = mount(DirectionList, { props: { directions, now, lang: 'zh' } })

    const bars = wrapper.findAll('[data-testid="direction-bar"]')
    expect(bars[0].attributes('style')).toContain('background-color: rgb(217, 68, 54)')
    expect(bars[1].attributes('style')).toContain('background-color: rgb(15, 137, 201)')
  })

  it('renders the "各方向末班車" / "All directions" label when the station has multiple directions', () => {
    const now = new Date(2026, 7, 31, 23, 0)
    const directions = [
      makeEntry({ TripHeadSign: '往象山', LastTrainTime: '22:50' }),
      makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '23:10' }),
    ]

    const wrapper = mount(DirectionList, { props: { directions, now, lang: 'en' } })

    expect(wrapper.text()).toContain('All directions')
    expect(wrapper.get('[data-testid="direction-row"]').text()).toContain('to Xiangshan')
    expect(wrapper.get('[data-testid="direction-row"]').text()).toContain('departed')
  })

  it('renders the "末班車" / "Last train" label when the station has only one direction (terminal station)', () => {
    const now = new Date(2026, 7, 31, 23, 0)
    const directions = [makeEntry({ TripHeadSign: '往象山', LastTrainTime: '23:30' })]

    const zh = mount(DirectionList, { props: { directions, now, lang: 'zh' } })
    const en = mount(DirectionList, { props: { directions, now, lang: 'en' } })

    expect(zh.text()).toContain('末班車')
    expect(zh.text()).not.toContain('各方向末班車')
    expect(en.text()).toContain('Last train')
    expect(en.text()).not.toContain('All directions')
  })

  it('renders no rows when given an empty list', () => {
    const wrapper = mount(DirectionList, { props: { directions: [], now: new Date(2026, 7, 31, 23, 0), lang: 'zh' } })

    expect(wrapper.findAll('[data-testid="direction-row"]')).toHaveLength(0)
  })

  it('renders a favorite button per row reflecting current favorited state', () => {
    const now = new Date(2026, 7, 31, 23, 0)
    const directions = [
      makeEntry({ TripHeadSign: '往象山' }),
      makeEntry({ TripHeadSign: '往淡水' }),
    ]
    useFavorites().toggleFavorite('R', 'R05', '往淡水')

    const wrapper = mount(DirectionList, { props: { directions, now, lang: 'zh' } })

    const stars = wrapper.findAll('[data-testid="favorite-button"]')
    expect(stars).toHaveLength(2)
    expect(stars[0].text()).toBe('☆')
    expect(stars[1].text()).toBe('★')
  })

  it('toggles the favorite in useFavorites when a row’s favorite button is clicked', async () => {
    const now = new Date(2026, 7, 31, 23, 0)
    const directions = [makeEntry({ TripHeadSign: '往象山' })]

    const wrapper = mount(DirectionList, { props: { directions, now, lang: 'zh' } })
    await wrapper.get('[data-testid="favorite-button"]').trigger('click')

    expect(useFavorites().isFavorited('R', 'R05', '往象山')).toBe(true)
  })

  it('shows a hint to favorite a direction when the station has no favorited direction yet', () => {
    const now = new Date(2026, 7, 31, 23, 0)
    const directions = [makeEntry({ TripHeadSign: '往象山' })]

    const wrapper = mount(DirectionList, { props: { directions, now, lang: 'zh' } })

    expect(wrapper.text()).toContain('按 ☆ 把這個方向放到首頁')
  })

  it('hides the hint once at least one direction at the station is favorited', () => {
    const now = new Date(2026, 7, 31, 23, 0)
    const directions = [makeEntry({ TripHeadSign: '往象山' })]
    useFavorites().toggleFavorite('R', 'R05', '往象山')

    const wrapper = mount(DirectionList, { props: { directions, now, lang: 'zh' } })

    expect(wrapper.text()).not.toContain('按 ☆ 把這個方向放到首頁')
  })
})
