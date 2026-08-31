import { minutesUntil } from './minutesUntil'
import type { FirstLastTimetable } from './types'

export interface FeaturedDirection {
  entry: FirstLastTimetable
  mins: number
}

export function pickFeaturedDirection(entries: FirstLastTimetable[], now: Date): FeaturedDirection | null {
  if (entries.length === 0) {
    return null
  }

  const withMins = entries.map((entry) => ({ entry, mins: minutesUntil(entry.LastTrainTime, now) }))
  const upcoming = withMins.filter((candidate) => candidate.mins >= 0)

  if (upcoming.length > 0) {
    return upcoming.reduce((soonest, candidate) => (candidate.mins < soonest.mins ? candidate : soonest))
  }

  return withMins.reduce((mostRecent, candidate) => (candidate.mins > mostRecent.mins ? candidate : mostRecent))
}
