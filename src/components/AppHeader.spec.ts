import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from './AppHeader.vue'
import { useLanguage } from '../composables/useLanguage'

describe('AppHeader', () => {
  beforeEach(() => {
    useLanguage().setLang('zh')
  })

  it('renders the English brand name and the Chinese name', () => {
    const wrapper = mount(AppHeader)

    expect(wrapper.text()).toContain('Metro Rush Tonight')
    expect(wrapper.text()).toContain('趕捷運')
  })

  it('renders 中/EN toggle buttons, "中" active by default', () => {
    const wrapper = mount(AppHeader)

    const zh = wrapper.get('[data-testid="lang-zh"]')
    const en = wrapper.get('[data-testid="lang-en"]')
    expect(zh.text()).toBe('中')
    expect(en.text()).toBe('EN')
    expect(zh.attributes('style')).toContain('background-color: rgb(255, 255, 255)')
    expect(en.attributes('style')).not.toContain('background-color: rgb(255, 255, 255)')
  })

  it('switches the shared language state when "EN" is clicked', async () => {
    const wrapper = mount(AppHeader)

    await wrapper.get('[data-testid="lang-en"]').trigger('click')

    expect(useLanguage().lang.value).toBe('en')
  })

  it('switches back to zh when "中" is clicked', async () => {
    useLanguage().setLang('en')
    const wrapper = mount(AppHeader)

    await wrapper.get('[data-testid="lang-zh"]').trigger('click')

    expect(useLanguage().lang.value).toBe('zh')
  })
})
