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
  StationName: { Zh_tw: '大安', En: 'Daan' },
  Sequence: 5,
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

describe('HeroCard', () => {
  it('renders the station name', () => {
    const wrapper = mount(HeroCard, {
      props: {
        station,
        lineColor: '#d90023',
        timetable: [makeEntry()],
        now: new Date(2026, 7, 31, 23, 0),
        lang: 'zh',
      },
    })

    expect(wrapper.text()).toContain('大安')
  })

  describe('multiple directions (auto mode)', () => {
    it('shows the countdown, departure info, and "soonest" label for the soonest of several directions', () => {
      const wrapper = mount(HeroCard, {
        props: {
          station,
          lineColor: '#d90023',
          timetable: [
            makeEntry({ TripHeadSign: '往象山', LastTrainTime: '23:20' }),
            makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '23:45' }),
          ],
          now: new Date(2026, 7, 31, 23, 0), // 20 minutes before 23:20
          lang: 'zh',
        },
      })

      expect(wrapper.get('[data-testid="countdown"]').text()).toBe('20')
      expect(wrapper.text()).toContain('23:20 開 · 往象山')
      expect(wrapper.get('[data-testid="hero-label"]').text()).toBe('最近一班末班車')
    })

    it('shows a struck-through departed time and "all done" label once every direction has left', () => {
      const wrapper = mount(HeroCard, {
        props: {
          station,
          lineColor: '#d90023',
          timetable: [
            makeEntry({ TripHeadSign: '往象山', LastTrainTime: '00:50' }),
            makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '00:20' }),
          ],
          now: new Date(2026, 8, 1, 1, 0), // 10/40 minutes after — both gone
          lang: 'zh',
        },
      })

      expect(wrapper.find('[data-testid="countdown"]').exists()).toBe(false)
      expect(wrapper.get('[data-testid="departed-time"]').text()).toBe('00:50')
      expect(wrapper.text()).toContain('末班車已離站')
      expect(wrapper.get('[data-testid="hero-label"]').text()).toBe('各方向都收班了')
      expect(wrapper.text()).toContain('今晚的捷運先睡了。')
    })

    it('says the shown direction closed for the night when a sibling direction is still live', () => {
      const wrapper = mount(HeroCard, {
        props: {
          station,
          lineColor: '#d90023',
          timetable: [
            makeEntry({ TripHeadSign: '往象山', LastTrainTime: '22:50' }), // departed
            makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '23:30' }), // still live
          ],
          now: new Date(2026, 7, 31, 23, 0),
          lang: 'zh',
        },
      })

      // auto mode always shows the live one when any exists, so this only
      // arises via a specified direction — covered below. Here we just
      // confirm auto mode picks the live direction, not the departed one.
      expect(wrapper.get('[data-testid="countdown"]').text()).toBe('30')
    })

    it('shows the tier copy text and applies the tier background color to the card', () => {
      const wrapper = mount(HeroCard, {
        props: {
          station,
          lineColor: '#d90023',
          timetable: [
            makeEntry({ TripHeadSign: '往象山', LastTrainTime: '23:30' }), // calm
            makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '23:45' }),
          ],
          now: new Date(2026, 7, 31, 23, 0),
          lang: 'zh',
        },
      })

      expect(wrapper.text()).toContain('慢慢走就好，別跑。')
      expect(wrapper.get('[data-testid="hero-card"]').attributes('style')).toContain(
        'background-color: rgb(223, 240, 251)',
      )
    })

    it('renders English text when lang is "en"', () => {
      const wrapper = mount(HeroCard, {
        props: {
          station,
          lineColor: '#d90023',
          timetable: [
            makeEntry({ TripHeadSign: '往象山', LastTrainTime: '23:20' }),
            makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '23:45' }),
          ],
          now: new Date(2026, 7, 31, 23, 0),
          lang: 'en',
        },
      })

      expect(wrapper.text()).toContain('Daan')
      expect(wrapper.text()).toContain('departs 23:20 · to Xiangshan')
      expect(wrapper.get('[data-testid="hero-label"]').text()).toBe('Soonest last train')
    })
  })

  describe('single direction (terminal station)', () => {
    it('shows the direction’s own name as the label instead of "soonest", and omits it from the sub-text', () => {
      const wrapper = mount(HeroCard, {
        props: {
          station,
          lineColor: '#d90023',
          timetable: [makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '23:20' })],
          now: new Date(2026, 7, 31, 23, 0),
          lang: 'zh',
        },
      })

      expect(wrapper.get('[data-testid="hero-label"]').text()).toBe('往淡水')
      expect(wrapper.text()).toContain('23:20 開')
      expect(wrapper.text()).not.toContain('23:20 開 · 往淡水')
    })
  })

  describe('specified direction (from a favorite)', () => {
    const directions: FirstLastTimetable[] = [
      makeEntry({ TripHeadSign: '往象山', LastTrainTime: '22:50' }), // departed
      makeEntry({ TripHeadSign: '往淡水', LastTrainTime: '23:30' }), // still live
    ]

    it('always shows the specified direction, even when a sibling direction is still live', () => {
      const wrapper = mount(HeroCard, {
        props: {
          station,
          lineColor: '#d90023',
          timetable: directions,
          now: new Date(2026, 7, 31, 23, 0),
          lang: 'zh',
          specifiedDirection: '往象山',
        },
      })

      expect(wrapper.find('[data-testid="countdown"]').exists()).toBe(false)
      expect(wrapper.get('[data-testid="departed-time"]').text()).toBe('22:50')
      expect(wrapper.get('[data-testid="hero-label"]').text()).toBe('往象山')
    })

    it('shows a "我的路線" badge only when a direction was specified', () => {
      const specified = mount(HeroCard, {
        props: {
          station,
          lineColor: '#d90023',
          timetable: directions,
          now: new Date(2026, 7, 31, 23, 0),
          lang: 'zh',
          specifiedDirection: '往淡水',
        },
      })
      const auto = mount(HeroCard, {
        props: { station, lineColor: '#d90023', timetable: directions, now: new Date(2026, 7, 31, 23, 0), lang: 'zh' },
      })

      expect(specified.get('[data-testid="from-home-badge"]').text()).toBe('我的路線')
      expect(auto.find('[data-testid="from-home-badge"]').exists()).toBe(false)
    })

    it('does not lie: says the specified direction closed while another is still running', () => {
      const wrapper = mount(HeroCard, {
        props: {
          station,
          lineColor: '#d90023',
          timetable: directions,
          now: new Date(2026, 7, 31, 23, 0),
          lang: 'zh',
          specifiedDirection: '往象山',
        },
      })

      expect(wrapper.text()).toContain('往象山今晚收班了。')
      expect(wrapper.text()).not.toContain('今晚的捷運先睡了。')
    })
  })

  it('renders nothing when the station has no timetable entries', () => {
    const wrapper = mount(HeroCard, {
      props: {
        station,
        lineColor: '#d90023',
        timetable: [],
        now: new Date(2026, 7, 31, 23, 0),
        lang: 'zh',
      },
    })

    expect(wrapper.find('[data-testid="hero-card"]').exists()).toBe(false)
  })
})
