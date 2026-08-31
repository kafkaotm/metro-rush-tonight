import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroCard from './HeroCard.vue'
import type { FirstLastTimetable, ServiceDay, Station } from '../logic/types'

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

const station: Station = {
  StationID: 'R05',
  StationName: { Zh_tw: '大安' },
  Sequence: 5,
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

describe('HeroCard', () => {
  it('renders the station name', () => {
    const wrapper = mount(HeroCard, {
      props: {
        station,
        lineColor: '#d90023',
        timetable: [makeEntry()],
        now: new Date(2026, 7, 31, 23, 0),
      },
    })

    expect(wrapper.text()).toContain('大安')
  })

  it('shows the countdown number and departure info when the last train hasn’t left yet', () => {
    const wrapper = mount(HeroCard, {
      props: {
        station,
        lineColor: '#d90023',
        timetable: [makeEntry({ TripHeadSign: '往象山', LastTrainTime: '23:20' })],
        now: new Date(2026, 7, 31, 23, 0), // 20 minutes before 23:20
      },
    })

    expect(wrapper.get('[data-testid="countdown"]').text()).toBe('20')
    expect(wrapper.text()).toContain('23:20 開 · 往象山')
    expect(wrapper.get('[data-testid="hero-label"]').text()).toBe('最近一班末班車')
  })

  it('shows a struck-through departed time and a "departed" tag once the last train has left', () => {
    const wrapper = mount(HeroCard, {
      props: {
        station,
        lineColor: '#d90023',
        timetable: [makeEntry({ TripHeadSign: '往象山', LastTrainTime: '00:50' })],
        now: new Date(2026, 8, 1, 1, 0), // 10 minutes after 00:50
      },
    })

    expect(wrapper.find('[data-testid="countdown"]').exists()).toBe(false)
    expect(wrapper.get('[data-testid="departed-time"]').text()).toBe('00:50')
    expect(wrapper.text()).toContain('末班車已離站')
    expect(wrapper.get('[data-testid="hero-label"]').text()).toBe('各方向都收班了')
  })

  it('shows the tier copy text and applies the tier background color to the card', () => {
    const wrapper = mount(HeroCard, {
      props: {
        station,
        lineColor: '#d90023',
        // 30 minutes away -> calm tier
        timetable: [makeEntry({ LastTrainTime: '23:30' })],
        now: new Date(2026, 7, 31, 23, 0),
      },
    })

    expect(wrapper.text()).toContain('慢慢走就好，別跑。')
    expect(wrapper.get('[data-testid="hero-card"]').attributes('style')).toContain('background-color: rgb(223, 240, 251)')
  })

  it('renders nothing when the station has no timetable entries', () => {
    const wrapper = mount(HeroCard, {
      props: {
        station,
        lineColor: '#d90023',
        timetable: [],
        now: new Date(2026, 7, 31, 23, 0),
      },
    })

    expect(wrapper.find('[data-testid="hero-card"]').exists()).toBe(false)
  })
})
