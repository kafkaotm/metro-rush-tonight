import { minutesUntil } from './minutesUntil'
import { getTier, type Tier } from './tier'
import type { FirstLastTimetable } from './types'

export interface DirectionSummary {
  entry: FirstLastTimetable
  mins: number
  tier: Tier
  gapLabel: string
}

export function summarizeDirections(entries: FirstLastTimetable[], now: Date): DirectionSummary[] {
  return entries.map((entry) => {
    const mins = minutesUntil(entry.LastTrainTime, now)
    return {
      entry,
      mins,
      tier: getTier(mins),
      gapLabel: mins < 0 ? '已過站' : `+${mins} min`,
    }
  })
}
