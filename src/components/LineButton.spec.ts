import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LineButton from './LineButton.vue'
import type { Line } from '../logic/types'

function makeLine(overrides: Partial<Line> = {}): Line {
  return {
    LineID: 'R',
    LineName: { Zh_tw: '淡水信義線', En: 'Tamsui-Xinyi Line' },
    LineSectionName: {},
    LineColor: '#d90023',
    LineNo: 'R',
    IsBranch: false,
    VersionID: 2,
    SrcUpdateTime: '2020-01-31T14:00:00+08:00',
    UpdateTime: '2020-05-20T12:00:00+08:00',
    ...overrides,
  }
}

describe('LineButton', () => {
  it('renders the line’s Chinese name', () => {
    const wrapper = mount(LineButton, { props: { line: makeLine() } })

    expect(wrapper.text()).toContain('淡水信義線')
  })

  it('renders a code badge showing LineNo, colored with LineColor', () => {
    const wrapper = mount(LineButton, {
      props: { line: makeLine({ LineNo: 'R', LineColor: '#d90023' }) },
    })

    const badge = wrapper.get('[data-testid="line-badge"]')
    expect(badge.text()).toBe('R')
    expect(badge.attributes('style')).toContain('background-color: rgb(217, 0, 35)')
  })

  it('falls back to LineID for the badge when LineNo is absent', () => {
    const wrapper = mount(LineButton, {
      props: { line: makeLine({ LineID: 'BL', LineNo: undefined }) },
    })

    expect(wrapper.get('[data-testid="line-badge"]').text()).toBe('BL')
  })

  it('emits a click event when clicked', async () => {
    const wrapper = mount(LineButton, { props: { line: makeLine() } })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
