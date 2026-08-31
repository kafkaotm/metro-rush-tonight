import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LineSelector from './LineSelector.vue'
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

const lines: Line[] = [
  makeLine({ LineID: 'R', LineName: { Zh_tw: '淡水信義線', En: 'Tamsui-Xinyi Line' }, LineColor: '#d90023', LineNo: 'R' }),
  makeLine({ LineID: 'BL', LineName: { Zh_tw: '板南線', En: 'Bannan Line' }, LineColor: '#0a59ae', LineNo: 'BL' }),
]

describe('LineSelector', () => {
  it('renders the Chinese name of every line passed in', () => {
    const wrapper = mount(LineSelector, { props: { lines, lang: 'zh' } })

    expect(wrapper.text()).toContain('淡水信義線')
    expect(wrapper.text()).toContain('板南線')
  })

  it('emits "select" with the LineID when a line is clicked', async () => {
    const wrapper = mount(LineSelector, { props: { lines, lang: 'zh' } })

    await wrapper.findAll('[data-testid="line-option"]')[1].trigger('click')

    expect(wrapper.emitted('select')).toEqual([['BL']])
  })

  it('renders each line option with a code badge in its LineColor', () => {
    const wrapper = mount(LineSelector, { props: { lines, lang: 'zh' } })

    const badges = wrapper.findAll('[data-testid="line-badge"]')
    expect(badges[0].attributes('style')).toContain('background-color: rgb(217, 0, 35)')
    expect(badges[0].text()).toBe('R')
    expect(badges[1].attributes('style')).toContain('background-color: rgb(10, 89, 174)')
    expect(badges[1].text()).toBe('BL')
  })

  it('renders no line options when given an empty list', () => {
    const wrapper = mount(LineSelector, { props: { lines: [], lang: 'zh' } })

    expect(wrapper.findAll('[data-testid="line-option"]')).toHaveLength(0)
  })
})
