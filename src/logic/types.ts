// Verified against TDX's OpenAPI V3 spec for GET /v2/Rail/Metro/StationOfLine/{RailSystem}
// (https://tdx.transportdata.tw/webapi/File/Swagger/V3/268fc230-2e04-471b-a728-a726167c1cfc).
export interface NameType {
  Zh_tw: string
  En?: string
}

export interface Station {
  StationID: string
  StationName: NameType
  Sequence: number
  CumulativeDistance?: number
}

export interface StationOfLine {
  LineID: string
  Stations: Station[]
}
