import type { Lang } from '../composables/useLanguage'
import { directionLabel } from './directionLabel'
import { minutesUntil } from './minutesUntil'
import { getTier, TIER_STYLES } from './tier'
import type { FirstLastTimetable } from './types'

export function heroCopy(
  allDirections: FirstLastTimetable[],
  featured: FirstLastTimetable,
  now: Date,
  lang: Lang,
): string {
  const mins = minutesUntil(featured.LastTrainTime, now)
  const tier = getTier(mins)
  if (tier !== 'gone') {
    return TIER_STYLES[tier].copy[lang]
  }

  const otherStillLive = allDirections.some(
    (entry) => entry !== featured && minutesUntil(entry.LastTrainTime, now) >= 0,
  )
  if (!otherStillLive) {
    return TIER_STYLES.gone.copy[lang]
  }

  if (lang === 'en') {
    return 'This direction is done for tonight.'
  }
  return `${directionLabel(featured, lang)}今晚收班了。`
}
