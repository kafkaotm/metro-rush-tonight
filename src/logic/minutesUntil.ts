function toCandidate(timeString: string, now: Date, dayOffset: number): Date {
  const [hours, minutes] = timeString.split(':').map(Number)
  const candidate = new Date(now)
  candidate.setDate(candidate.getDate() + dayOffset)
  candidate.setHours(hours, minutes, 0, 0)
  return candidate
}

export function minutesUntil(timeString: string, now: Date): number {
  const candidates = [-1, 0, 1].map((dayOffset) => toCandidate(timeString, now, dayOffset))
  const closest = candidates.reduce((best, candidate) =>
    Math.abs(candidate.getTime() - now.getTime()) < Math.abs(best.getTime() - now.getTime()) ? candidate : best,
  )
  return Math.round((closest.getTime() - now.getTime()) / 60000)
}
