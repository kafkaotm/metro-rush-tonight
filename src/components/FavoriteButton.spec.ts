import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FavoriteButton from './FavoriteButton.vue'

describe('FavoriteButton', () => {
  it('shows ☆ on a light background when not favorited', () => {
    const wrapper = mount(FavoriteButton, { props: { favorited: false } })

    expect(wrapper.text()).toBe('☆')
    expect(wrapper.attributes('style')).toContain('background-color: rgb(241, 246, 249)')
  })

  it('shows ★ on a blue-tinted background when favorited', () => {
    const wrapper = mount(FavoriteButton, { props: { favorited: true } })

    expect(wrapper.text()).toBe('★')
    expect(wrapper.attributes('style')).toContain('background-color: rgba(15, 137, 201, 0.14)')
  })

  it('emits a click event when clicked', async () => {
    const wrapper = mount(FavoriteButton, { props: { favorited: false } })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
