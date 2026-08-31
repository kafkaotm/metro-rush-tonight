import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useNow(intervalMs = 30000): Ref<Date> {
  const now = ref(new Date())
  let timer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    timer = setInterval(() => {
      now.value = new Date()
    }, intervalMs)
  })

  onUnmounted(() => {
    clearInterval(timer)
  })

  return now
}
