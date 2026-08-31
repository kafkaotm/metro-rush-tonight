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

async function getJson<T>(token: string, path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    throw new Error(`TDX fetch ${path} failed: ${res.status} ${await res.text()}`)
  }
  return res.json() as Promise<T>
}

async function writeData(filename: string, data: unknown): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(new URL(filename, DATA_DIR), `${JSON.stringify(data, null, 2)}\n`)
}

const token = await getToken()

const lines = await getJson<Line[]>(token, '/Line/TRTC?%24format=JSON')
await writeData('lines.json', lines)
console.log(`Line/TRTC: ${lines.length} entries`)

const stationsOfLine = await getJson<StationOfLine[]>(token, '/StationOfLine/TRTC?%24format=JSON')
await writeData('stationsOfLine.json', stationsOfLine)
console.log(`StationOfLine/TRTC: ${stationsOfLine.length} entries`)

const timetable = await getJson<FirstLastTimetable[]>(token, '/FirstLastTimetable/TRTC?%24format=JSON')
await writeData('timetable.json', timetable)
console.log(`FirstLastTimetable/TRTC: ${timetable.length} entries`)
