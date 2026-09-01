import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FavoriteCard from './FavoriteCard.vue'
import type { ResolvedFavorite } from '../logic/resolveFavorite'
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

function makeResolved(overrides: Partial<ResolvedFavorite> = {}): ResolvedFavorite {
  const entry: FirstLastTimetable = {
    LineID: 'R',
    StationID: 'R05',
    StationName: { Zh_tw: '大安', En: 'Daan' },
    TripHeadSign: '往象山',
    DestinationStaionID: 'R02',
    DestinationStationName: { Zh_tw: '象山', En: 'Xiangshan' },
    FirstTrainTime: '06:00',
    LastTrainTime: '23:30',
    ServiceDay: everyDay,
  }
  return {
    favorite: { lineId: 'R', stationId: 'R05', direction: '往象山' },
    stationName: { Zh_tw: '大安', En: 'Daan' },
    lineName: { Zh_tw: '淡水信義線', En: 'Tamsui-Xinyi Line' },
    lineColor: '#d90023',
    entry,
    ...overrides,
  }
}

describe('FavoriteCard', () => {
  it('renders the station name, direction, and line name', () => {
    const wrapper = mount(FavoriteCard, {
      props: { resolved: makeResolved(), now: new Date(2026, 7, 31, 23, 0), lang: 'zh', editing: false },
    })

    expect(wrapper.text()).toContain('大安')
    expect(wrapper.text()).toContain('往象山 · 淡水信義線')
  })

  it('shows the countdown minutes and departure time when still catchable', () => {
    const wrapper = mount(FavoriteCard, {
      props: { resolved: makeResolved(), now: new Date(2026, 7, 31, 23, 0), lang: 'zh', editing: false }, // 30 min away
    })

    expect(wrapper.get('[data-testid="favorite-countdown"]').text()).toBe('30')
    expect(wrapper.text()).toContain('23:30 開')
  })

  it('shows "—" and "已收班" once the last train has departed', () => {
    const resolved = makeResolved({ entry: { ...makeResolved().entry, LastTrainTime: '22:00' } })
    const wrapper = mount(FavoriteCard, {
      props: { resolved, now: new Date(2026, 7, 31, 23, 0), lang: 'zh', editing: false },
    })

    expect(wrapper.get('[data-testid="favorite-countdown"]').text()).toBe('—')
    expect(wrapper.text()).toContain('已收班')
  })

  it('emits "select" when clicked', async () => {
    const wrapper = mount(FavoriteCard, {
      props: { resolved: makeResolved(), now: new Date(2026, 7, 31, 23, 0), lang: 'zh', editing: false },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('select')).toHaveLength(1)
  })

  it('turns the card background panic-red when under 5 minutes remain', () => {
    const resolved = makeResolved({ entry: { ...makeResolved().entry, LastTrainTime: '23:03' } }) // 3 min
    const wrapper = mount(FavoriteCard, {
      props: { resolved, now: new Date(2026, 7, 31, 23, 0), lang: 'zh', editing: false },
    })

    expect(wrapper.attributes('style')).toContain('background-color: rgb(253, 227, 223)')
  })

  it('shows a remove button only in editing mode, and emits "remove" when clicked', async () => {
    const notEditing = mount(FavoriteCard, {
      props: { resolved: makeResolved(), now: new Date(2026, 7, 31, 23, 0), lang: 'zh', editing: false },
    })
    expect(notEditing.find('[data-testid="favorite-remove"]').exists()).toBe(false)

    const editing = mount(FavoriteCard, {
      props: { resolved: makeResolved(), now: new Date(2026, 7, 31, 23, 0), lang: 'zh', editing: true },
    })
    await editing.get('[data-testid="favorite-remove"]').trigger('click')

    expect(editing.emitted('remove')).toHaveLength(1)
  })
})
