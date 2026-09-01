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

export function toLocalDate(iso: string): Date {
    const [year, month, day] = iso.split('-').map(Number)
    return new Date(year, month - 1, day)
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