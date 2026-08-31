export type Tier = 'calm' | 'run' | 'panic' | 'gone'

export function getTier(mins: number): Tier {
  if (mins < 0) return 'gone'
  if (mins < 5) return 'panic'
  if (mins <= 20) return 'run'
  return 'calm'
}

export const TIER_STYLES: Record<Tier, { color: string; bg: string; copy: string }> = {
  calm: { color: '#0f89c9', bg: '#dff0fb', copy: '慢慢走就好，別跑。' },
  run: { color: '#c98209', bg: '#fdf0d8', copy: '跑得動！現在出發還來得及。' },
  panic: { color: '#d94436', bg: '#fde3df', copy: '快跑！別再滑手機了。' },
  gone: { color: '#6b8998', bg: '#e6ecef', copy: '今晚的捷運先睡了。' },
}
