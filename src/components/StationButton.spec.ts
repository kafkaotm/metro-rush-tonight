import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StationButton from './StationButton.vue'
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

describe('StationButton', () => {
  it('renders the station’s Chinese name', () => {
    const wrapper = mount(StationButton, {
      props: { station: makeStation(), lineColor: '#d90023', lang: 'zh' },
    })

    expect(wrapper.text()).toContain('大安')
  })

  it('renders the station’s English name when lang is "en"', () => {
    const wrapper = mount(StationButton, {
      props: { station: makeStation(), lineColor: '#d90023', lang: 'en' },
    })

    expect(wrapper.text()).toContain('Daan')
  })

  it('renders a platform dot bordered in the given lineColor', () => {
    const wrapper = mount(StationButton, {
      props: { station: makeStation(), lineColor: '#d90023', lang: 'zh' },
    })

    const dot = wrapper.get('[data-testid="platform-dot"]')
    expect(dot.attributes('style')).toContain('border-color: rgb(217, 0, 35)')
  })

  it('emits a click event when clicked', async () => {
    const wrapper = mount(StationButton, {
      props: { station: makeStation(), lineColor: '#d90023', lang: 'zh' },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
