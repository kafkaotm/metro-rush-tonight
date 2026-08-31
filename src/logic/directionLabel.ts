import type { Lang } from '../composables/useLanguage'
import type { FirstLastTimetable } from './types'

export function directionLabel(entry: FirstLastTimetable, lang: Lang): string {
  if (lang === 'en') {
    return `to ${entry.DestinationStationName.En}`
  }
  return entry.TripHeadSign ?? ''
}
