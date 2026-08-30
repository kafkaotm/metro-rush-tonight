import type { Station, StationOfLine } from './types'

export function filterStationsByLine(stationsOfLine: StationOfLine[], lineId: string): Station[] {
  return stationsOfLine.find((line) => line.LineID === lineId)?.Stations ?? []
}
