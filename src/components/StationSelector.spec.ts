import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StationSelector from './StationSelector.vue'
import type { Station } from '../logic/types'

function makeStation(overrides: Partial<Station> = {}): Station {
  return {
    StationID: 'R05',
    StationName: { Zh_tw: '大安', En: 'Daan' },
    Sequence: 5,
    CumulativeDistance: 4.2,
    ...overrides,
  }
}

const stations: Station[] = [
  makeStation({ StationID: 'R04', StationName: { Zh_tw: '信義安和', En: 'Xinyi Anhe' }, Sequence: 4 }),
  makeStation({ StationID: 'R05', StationName: { Zh_tw: '大安', En: 'Daan' }, Sequence: 5 }),
]

describe('StationSelector', () => {
  it('renders the Chinese name of every station passed in, in the given order', () => {
    const wrapper = mount(StationSelector, { props: { stations, lineColor: '#d90023' } })

    const options = wrapper.findAll('[data-testid="station-option"]')
    expect(options.map((o) => o.text())).toEqual(['信義安和', '大安'])
  })

  it('emits "select" with the StationID when a station is clicked', async () => {
    const wrapper = mount(StationSelector, { props: { stations, lineColor: '#d90023' } })

    await wrapper.findAll('[data-testid="station-option"]')[1].trigger('click')

    expect(wrapper.emitted('select')).toEqual([['R05']])
  })

  it('renders no station options when given an empty list', () => {
    const wrapper = mount(StationSelector, { props: { stations: [], lineColor: '#d90023' } })

    expect(wrapper.findAll('[data-testid="station-option"]')).toHaveLength(0)
  })
})
