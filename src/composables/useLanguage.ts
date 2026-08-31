import { ref } from 'vue'

export type Lang = 'zh' | 'en'

const lang = ref<Lang>('zh')

export function useLanguage() {
  function setLang(next: Lang) {
    lang.value = next
  }

  return { lang, setLang }
}
