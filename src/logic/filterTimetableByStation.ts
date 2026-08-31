import type { FirstLastTimetable } from './types'

export function filterTimetableByStation(
  timetables: FirstLastTimetable[],
  stationId: string,
): FirstLastTimetable[] {
  return timetables.filter((entry) => entry.StationID === stationId)
}
