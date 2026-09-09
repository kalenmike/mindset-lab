export type CalendarDay = {
    label?: string
    title?: string
    note?: string
    href?: string
    linkLabel?: string
    releaseDate?: string
}

export type ExperimentCalendar = {
    start: string
    end: string
    days?: Record<string, CalendarDay>
}

export type DurationLike = {
    start: string
    duration: string
    calendar?: ExperimentCalendar
}

export function formatDateLabel(date: Date): string {
    return new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date)
}

const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

export function formatDateTime(iso: string): string {
    const date = toLocalDate(iso)
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${hours}:${minutes}`
}

export function relativeTime(iso: string, now: Date = new Date()): string {
    const date = toLocalDate(iso)
    const diffMs = now.getTime() - date.getTime()
    if (diffMs < 60_000) return 'just now'
    const minutes = Math.floor(diffMs / 60_000)
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
    const days = Math.floor((utcDay(now) - utcDay(date)) / 86400000)
    if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
    if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) === 1 ? '' : 's'} ago`
    return `${Math.floor(days / 365)} year${Math.floor(days / 365) === 1 ? '' : 's'} ago`
}

export function toLocalDate(iso: string): Date {
    const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/)
    if (!match) return new Date(NaN)
    const [, year, month, day, hour = '0', minute = '0'] = match
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute))
}

export function toISO(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function utcDay(date: Date): number {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
}

export function daysRemaining(end: Date, today: Date): number {
    return Math.max(0, Math.floor((utcDay(end) - utcDay(today)) / 86400000) + 1)
}

export function experimentEndDate(experiment: DurationLike): Date | null {
    if (experiment.calendar) return toLocalDate(experiment.calendar.end)
    const match = experiment.duration.match(/^(\d+)\s*days?/)
    if (!match) return null
    const start = toLocalDate(experiment.start)
    return new Date(start.getFullYear(), start.getMonth(), start.getDate() + Number(match[1]) - 1)
}

export function mondayOffset(date: Date): number {
    return (date.getDay() + 6) % 7
}

export function monthWeeks(year: number, month: number): (number | null)[][] {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (number | null)[] = [
        ...Array<null>(mondayOffset(new Date(year, month, 1))).fill(null),
    ]
    for (let day = 1; day <= daysInMonth; day += 1) cells.push(day)
    while (cells.length % 7 !== 0) cells.push(null)
    const weeks: (number | null)[][] = []
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
    return weeks
}