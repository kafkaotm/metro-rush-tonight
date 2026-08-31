import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PressableButton from './PressableButton.vue'

describe('PressableButton', () => {
  it('renders its slot content', () => {
    const wrapper = mount(PressableButton, {
      slots: { default: '淡水信義線' },
    })

    expect(wrapper.text()).toBe('淡水信義線')
  })

  it('renders as a native button with type="button" by default', () => {
    const wrapper = mount(PressableButton)

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
  })

  it('emits a click event when clicked', async () => {
    const wrapper = mount(PressableButton)

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
