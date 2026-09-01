import { useEffect, useState, type ReactNode } from 'react'

const MONTH_NAMES = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
]

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export function formatDateLabel(date: Date): string {
    return new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date)
}

function mondayOffset(date: Date): number {
    return (date.getDay() + 6) % 7
}

function monthWeeks(year: number, month: number): (number | null)[][] {
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

export type CalendarProps = {
    start: Date
    end: Date
    renderDay?: (date: Date) => ReactNode
    renderModal?: (date: Date) => ReactNode
}

export function Calendar({ start, end, renderDay, renderModal }: CalendarProps) {
    const [selected, setSelected] = useState<Date | null>(null)
    const [today, setToday] = useState<Date | null>(null)

    useEffect(() => {
        const now = new Date()
        setToday(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
    }, [])

    useEffect(() => {
        if (!selected) return
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelected(null)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [selected])

    const months: { year: number; month: number }[] = []
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
    const lastMonth = new Date(end.getFullYear(), end.getMonth(), 1)
    while (cursor <= lastMonth) {
        months.push({ year: cursor.getFullYear(), month: cursor.getMonth() })
        cursor.setMonth(cursor.getMonth() + 1)
    }

    const inRange = (date: Date) => date >= start && date <= end

    return (
        <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {months.map(({ year, month }) => (
                    <div key={`${year}-${month}`} className="border border-slate-800/70 p-3">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                            {MONTH_NAMES[month]} {year}
                        </p>
                        <div className="grid grid-cols-7 gap-1">
                            {WEEKDAYS.map((day) => (
                                <span
                                    key={day}
                                    className="pb-1 text-center text-[10px] font-bold uppercase tracking-wider text-slate-600"
                                >
                                    {day}
                                </span>
                            ))}
                            {monthWeeks(year, month)
                                .flat()
                                .map((day, index) => {
                                    if (day === null) return <span key={index} className="h-12" />
                                    const date = new Date(year, month, day)
                                    if (!inRange(date)) return <span key={index} className="h-12" />

                                    const isToday = today !== null && date.getTime() === today.getTime()
                                    const isFuture = today !== null && date > today

                                    const tone = isToday
                                        ? 'bg-slate-800 text-white ring-1 ring-slate-500'
                                        : isFuture
                                            ? 'bg-slate-900/25 text-slate-600 opacity-60 hover:opacity-90'
                                            : 'bg-slate-900/60'

                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setSelected(date)}
                                            aria-label={`${formatDateLabel(date)} — open field log`}
                                            aria-current={isToday ? 'date' : undefined}
                                            className={`relative flex h-12 items-center justify-center rounded-sm p-1 text-[10px] transition-colors hover:bg-slate-800 hover:text-white ${tone}`}
                                        >
                                            <span
                                                className={`absolute right-1 top-0.5 text-[9px] font-bold leading-none ${isToday ? 'text-white' : 'text-slate-500'}`}
                                            >
                                                {date.getDate()}
                                            </span>
                                            {renderDay ? renderDay(date) : null}
                                        </button>
                                    )
                                })}
                        </div>
                    </div>
                ))}
            </div>

            {selected && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Field log for ${formatDateLabel(selected)}`}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelected(null)}
                >
                    <div className="absolute inset-0 bg-black/70" />
                    <div
                        className="relative w-full max-w-md border border-slate-700 bg-slate-950 p-6"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                                {formatDateLabel(selected)}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelected(
                                            new Date(
                                                selected.getFullYear(),
                                                selected.getMonth(),
                                                selected.getDate() - 1,
                                            ),
                                        )
                                    }
                                    disabled={selected <= start}
                                    aria-label="Previous day"
                                    className="px-2 py-1 text-sm text-slate-400 transition-colors hover:text-white disabled:cursor-default disabled:text-slate-700 disabled:hover:text-slate-700"
                                >
                                    ←
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelected(
                                            new Date(
                                                selected.getFullYear(),
                                                selected.getMonth(),
                                                selected.getDate() + 1,
                                            ),
                                        )
                                    }
                                    disabled={selected >= end}
                                    aria-label="Next day"
                                    className="px-2 py-1 text-sm text-slate-400 transition-colors hover:text-white disabled:cursor-default disabled:text-slate-700 disabled:hover:text-slate-700"
                                >
                                    →
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelected(null)}
                                    aria-label="Close"
                                    className="px-2 py-1 text-xs uppercase tracking-wider text-slate-500 transition-colors hover:text-white"
                                >
                                    [close]
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 text-sm leading-relaxed text-slate-300">
                            {renderModal ? (
                                renderModal(selected)
                            ) : (
                                <p className="text-slate-400">No log for this day.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
