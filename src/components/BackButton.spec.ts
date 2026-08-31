import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BackButton from './BackButton.vue'

describe('BackButton', () => {
  it('renders the arrow and the given label', () => {
    const wrapper = mount(BackButton, { props: { label: '換一條線' } })

    expect(wrapper.text()).toBe('← 換一條線')
  })

  it('emits a click event when clicked', async () => {
    const wrapper = mount(BackButton, { props: { label: '換站' } })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
