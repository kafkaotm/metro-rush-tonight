import type { FavoriteEntry } from '../composables/useFavorites'
import type { FirstLastTimetable, Line, NameType } from './types'

export interface ResolvedFavorite {
  favorite: FavoriteEntry
  stationName: NameType
  lineName: NameType
  lineColor: string
  entry: FirstLastTimetable
}

export function resolveFavorite(
  favorite: FavoriteEntry,
  lines: Line[],
  timetable: FirstLastTimetable[],
): ResolvedFavorite | null {
  const line = lines.find((candidate) => candidate.LineID === favorite.lineId)
  const entry = timetable.find(
    (candidate) =>
      candidate.LineID === favorite.lineId &&
      candidate.StationID === favorite.stationId &&
      candidate.DestinationStaionID === favorite.destinationStationId,
  )
  if (!line || !entry) {
    return null
  }

  return {
    favorite,
    stationName: entry.StationName,
    lineName: line.LineName,
    lineColor: line.LineColor,
    entry,
  }
}
