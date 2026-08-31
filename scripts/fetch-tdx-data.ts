import { mkdir, writeFile } from 'node:fs/promises'
import type { FirstLastTimetable, Line, StationOfLine } from '../src/logic/types.ts'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing ${name} in environment`)
  }
  return value
}

const clientId = requireEnv('TDX_CLIENT_ID')
const clientSecret = requireEnv('TDX_CLIENT_SECRET')

const AUTH_URL = 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token'
const API_BASE = 'https://tdx.transportdata.tw/api/basic/v2/Rail/Metro'
const DATA_DIR = new URL('../src/data/', import.meta.url)

async function getToken(): Promise<string> {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })
  if (!res.ok) {
    throw new Error(`TDX auth failed: ${res.status} ${await res.text()}`)
  }
  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function getJson<T>(token: string, path: string, retriesLeft = 3): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.status === 429 && retriesLeft > 0) {
    const retryAfterSeconds = Number(res.headers.get('Retry-After')) || 30
    console.log(`Rate limited on ${path}, retrying in ${retryAfterSeconds}s...`)
    await sleep(retryAfterSeconds * 1000)
    return getJson<T>(token, path, retriesLeft - 1)
  }
  if (!res.ok) {
    throw new Error(`TDX fetch ${path} failed: ${res.status} ${await res.text()}`)
  }
  return res.json() as Promise<T>
}

async function writeData(filename: string, data: unknown): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(new URL(filename, DATA_DIR), `${JSON.stringify(data, null, 2)}\n`)
}

// TRTC (臺北捷運本體) + NTMC (環狀線，新北捷運營運). Their LineID/StationID
// namespaces don't overlap (Y / Y01-Y21 vs BL/BR/G/O/R), so results merge
// directly with no conflict handling needed.
const RAIL_SYSTEMS = ['TRTC', 'NTMC']

const token = await getToken()

const lines: Line[] = []
const stationsOfLine: StationOfLine[] = []
const timetable: FirstLastTimetable[] = []

for (const railSystem of RAIL_SYSTEMS) {
  const systemLines = await getJson<Line[]>(token, `/Line/${railSystem}?%24format=JSON`)
  lines.push(...systemLines)
  console.log(`Line/${railSystem}: ${systemLines.length} entries`)

  const systemStationsOfLine = await getJson<StationOfLine[]>(token, `/StationOfLine/${railSystem}?%24format=JSON`)
  stationsOfLine.push(...systemStationsOfLine)
  console.log(`StationOfLine/${railSystem}: ${systemStationsOfLine.length} entries`)

  const systemTimetable = await getJson<FirstLastTimetable[]>(token, `/FirstLastTimetable/${railSystem}?%24format=JSON`)
  timetable.push(...systemTimetable)
  console.log(`FirstLastTimetable/${railSystem}: ${systemTimetable.length} entries`)
}

await writeData('lines.json', lines)
await writeData('stationsOfLine.json', stationsOfLine)
await writeData('timetable.json', timetable)
