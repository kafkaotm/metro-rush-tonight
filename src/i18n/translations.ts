import type { Lang } from '../composables/useLanguage'

interface Translations {
  pickLine: string
  whichStation: string
  changeLine: string
  changeStation: string
  backHome: string
  soonest: string
  allDone: string
  allDirections: string
  oneDirection: string
  departed: string
  gapDeparted: string
  favHint: string
  fromHome: string
}

export const translations: Record<Lang, Translations> = {
  zh: {
    pickLine: '今晚搭哪條線？',
    whichStation: '你在哪一站？',
    changeLine: '換一條線',
    changeStation: '換站',
    backHome: '回首頁',
    soonest: '最近一班末班車',
    allDone: '各方向都收班了',
    allDirections: '各方向末班車',
    oneDirection: '末班車',
    departed: '末班車已離站',
    gapDeparted: '已過站',
    favHint: '按 ☆ 把這個方向放到首頁',
    fromHome: '我的路線',
  },
  en: {
    pickLine: 'Which line tonight?',
    whichStation: 'Where are you now?',
    changeLine: 'Change line',
    changeStation: 'Change station',
    backHome: 'Home',
    soonest: 'Soonest last train',
    allDone: 'All directions done',
    allDirections: 'All directions',
    oneDirection: 'Last train',
    departed: 'Last train has left',
    gapDeparted: 'departed',
    favHint: 'Tap ☆ to save this direction to your home screen',
    fromHome: 'SAVED',
  },
}

export function t(lang: Lang, key: keyof Translations): string {
  return translations[lang][key]
}
