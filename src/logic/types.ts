// Verified against TDX's OpenAPI V3 spec for GET /v2/Rail/Metro/StationOfLine/{RailSystem}
// (https://tdx.transportdata.tw/webapi/File/Swagger/V3/268fc230-2e04-471b-a728-a726167c1cfc).
export interface NameType {
  Zh_tw: string
  En?: string
}

// Verified against TDX's OpenAPI V3 spec for GET /v2/Rail/Metro/Line/{RailSystem}.
export interface Line {
  LineID: string
  LineName: NameType
  // Real API responses return `{}` for non-branch lines (Zh_tw absent), unlike every
  // other NameType field — confirmed against a live /Line/TRTC call.
  LineSectionName: Partial<NameType>
  LineColor: string
  LineNo?: string
  IsBranch: boolean
  VersionID: number
  SrcUpdateTime: string
  UpdateTime: string
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

// Verified against TDX's OpenAPI V3 spec for GET /v2/Rail/Metro/FirstLastTimetable/{RailSystem}.
export interface ServiceDay {
  Monday: boolean
  Tuesday: boolean
  Wednesday: boolean
  Thursday: boolean
  Friday: boolean
  Saturday: boolean
  Sunday: boolean
  NationalHolidays: boolean
  ServiceTag?: string
}

export interface FirstLastTimetable {
  LineID: string
  StationID: string
  StationName: NameType
  TripHeadSign?: string
  DestinationStaionID: string
  DestinationStationName: NameType
  TrainType?: number
  FirstTrainTime: string
  LastTrainTime: string
  ServiceDay: ServiceDay
}
