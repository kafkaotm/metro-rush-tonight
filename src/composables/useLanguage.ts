import { ref } from 'vue'

export type Lang = 'zh' | 'en'

const STORAGE_KEY = 'mrt.lang'

function readFromStorage(): Lang {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw === 'en' ? 'en' : 'zh'
}

const lang = ref<Lang>(readFromStorage())

export function useLanguage() {
  function setLang(next: Lang) {
    lang.value = next
    localStorage.setItem(STORAGE_KEY, next)
  }

  return { lang, setLang }
}
