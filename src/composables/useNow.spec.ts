import { defineComponent, h, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useNow } from './useNow'

function mountWithUseNow(intervalMs?: number) {
  let exposedNow!: Ref<Date>
  const TestComponent = defineComponent({
    setup() {
      exposedNow = useNow(intervalMs)
      return () => h('div', exposedNow.value.toISOString())
    },
  })
  const wrapper = mount(TestComponent)
  return { wrapper, now: exposedNow }
}

describe('useNow', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('updates the returned ref after each interval tick', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 31, 23, 0, 0))
    const { now } = mountWithUseNow(30000)
    const initial = now.value.getTime()

    vi.setSystemTime(new Date(2026, 7, 31, 23, 0, 30))
    vi.advanceTimersByTime(30000)

    expect(now.value.getTime()).toBeGreaterThan(initial)
  })

  it('stops updating once the component unmounts', () => {
    vi.useFakeTimers()
    const { wrapper, now } = mountWithUseNow(30000)
    wrapper.unmount()
    const afterUnmount = now.value.getTime()

    vi.advanceTimersByTime(120000)

    expect(now.value.getTime()).toBe(afterUnmount)
  })

  it('defaults to a 30 second interval', () => {
    vi.useFakeTimers()
    const { now } = mountWithUseNow()
    const initial = now.value.getTime()

    vi.advanceTimersByTime(29999)
    expect(now.value.getTime()).toBe(initial)

    vi.advanceTimersByTime(1)
    expect(now.value.getTime()).toBeGreaterThan(initial)
  })
})
