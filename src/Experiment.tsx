import { useEffect, useState } from 'react'
import experimentsJson from './experiments.json'
import { Calendar, formatDateLabel } from './Calendar'
import { CATEGORIES, type CategoryId } from './categories'
import { Logo } from './Logo'
import { Status } from './Status'
import { ThemeToggle, useTheme } from './theme'

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

export type Experiment = {
    slug: string
    title: string
    subtitle: string
    tagline: string
    status: string
    start: string
    duration: string
    tag: CategoryId
    description: string
    protocol: string[]
    href: string
    featured?: boolean
    calendar?: ExperimentCalendar
}

export const EXPERIMENTS = (
    experimentsJson.experiments as unknown as Experiment[]
).filter((experiment) => experiment.status !== 'HIDDEN')

function toLocalDate(iso: string): Date {
    const [year, month, day] = iso.split('-').map(Number)
    return new Date(year, month - 1, day)
}

function toISO(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function daysRemaining(end: Date, today: Date): number {
    const utcDay = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
    return Math.max(0, Math.floor((utcDay(end) - utcDay(today)) / 86400000) + 1)
}

function experimentEndDate(experiment: Experiment): Date | null {
    if (experiment.calendar) return toLocalDate(experiment.calendar.end)
    const match = experiment.duration.match(/^(\d+)\s*days?/)
    if (!match) return null
    const start = toLocalDate(experiment.start)
    return new Date(start.getFullYear(), start.getMonth(), start.getDate() + Number(match[1]) - 1)
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            <span className="text-slate-700">##</span> {children}
        </h2>
    )
}

export function ExperimentPage({ experiment }: { experiment: Experiment }) {
    const { theme, toggleTheme } = useTheme()
    const category = CATEGORIES[experiment.tag] ?? {
        name: experiment.tag,
        desc: '',
        color: 'text-slate-400',
    }

    const calendarStart = experiment.calendar ? toLocalDate(experiment.calendar.start) : null
    const calendarEnd = experiment.calendar ? toLocalDate(experiment.calendar.end) : null

    const [today, setToday] = useState<Date | null>(null)

    useEffect(() => {
        const now = new Date()
        setToday(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
    }, [])

    const endDate = experimentEndDate(experiment)
    const remaining = today && endDate ? daysRemaining(endDate, today) : null

    const dayIndex = (date: Date) => {
        if (!calendarStart) return 1
        const utcDay = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
        return Math.floor((utcDay(date) - utcDay(calendarStart)) / 86400000) + 1
    }

    return (
        <main className="min-h-svh bg-slate-950 font-mono text-slate-300 selection:bg-slate-300 selection:text-slate-950">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-6 py-12 sm:px-8">
                <header className="border-b border-dashed border-slate-800 pb-10">
                    <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1 pr-12 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                        <a href="../../" className="group inline-flex items-center gap-2 px-2 transition-colors hover:text-white">
                            <span className="text-slate-700 transition-transform group-hover:-translate-x-1">←</span>
                            MINDSET LAB
                        </a>
                        <span className="text-slate-700">/</span>
                        <span className="px-2 text-slate-500">EXPERIMENT</span>
                    </nav>
                    <Logo />
                </header>

                <section className="border-b border-dashed border-slate-800 py-10">
                    <div className="mb-6 flex flex-wrap items-baseline gap-4 text-xs">
                        <span className={`text-xs font-bold uppercase tracking-wider ${category.color}`}>
                            [{category.name}]
                        </span>
                        <span className="text-slate-600">status: </span>
                        <Status value={experiment.status} />
                        <span className="text-slate-600">start: {experiment.start}</span>
                        <span className="text-slate-600">duration: {experiment.duration}</span>
                    </div>
                    <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                        {experiment.title}
                        {experiment.subtitle ? (
                            <>
                                {' '}
                                <span className="font-normal text-slate-600">//</span>{' '}
                                <span className="text-slate-300">{experiment.subtitle}</span>
                            </>
                        ) : null}
                    </h1>
                    <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-400">
                        {experiment.tagline}
                    </p>
                    {experiment.status === 'LIVE' ? (
                        <p className="mt-10 text-sm text-slate-500">
                            {remaining !== null
                                ? `${remaining} ${remaining === 1 ? 'day' : 'days'} remaining`
                                : '[ IN PROGRESS ]'}
                        </p>
                    ) : (
                        <a
                            href={experiment.href}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-10 group inline-flex items-center gap-3 border border-slate-700 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-slate-100 hover:bg-slate-100 hover:text-slate-950"
                        >
                            <span className="text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-slate-950">
                                →
                            </span>
                            Read the write-up on Substack
                        </a>
                    )}
                </section>

                <section className="border-b border-dashed border-slate-800 py-10">
                    <SectionHeading>The Setup</SectionHeading>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
                        {experiment.description}
                    </p>
                </section>

                <section className="border-b border-dashed border-slate-800 py-10">
                    <SectionHeading>Protocol</SectionHeading>
                    <ol className="mt-6">
                        {experiment.protocol.map((step, index) => (
                            <li
                                key={index}
                                className="flex items-baseline gap-4 border-b border-slate-800/70 py-3 text-sm"
                            >
                                <span className="w-8 shrink-0 text-xs font-bold tracking-wider text-slate-600">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="text-slate-300">{step}</span>
                            </li>
                        ))}
                    </ol>
                </section>

                {experiment.calendar && calendarStart && calendarEnd && (
                    <section className="border-b border-dashed border-slate-800 py-10">
                        <SectionHeading>Calendar</SectionHeading>
                        <p className="mt-4 text-sm leading-relaxed text-slate-500">
                            Field notes and linked resources by experiment day.
                        </p>
                        <div className="mt-6">
                            <Calendar
                                start={calendarStart}
                                end={calendarEnd}
                                renderDay={(date) => {
                                    const entry = experiment.calendar?.days?.[toISO(date)]
                                    const available = !!entry?.href
                                    const pending = !available && !!entry?.releaseDate
                                    return (
                                        <span
                                            className={
                                                entry?.label
                                                    ? 'text-sm font-medium leading-none text-slate-300'
                                                    : 'text-sm leading-none text-slate-600'
                                            }
                                        >
                                            {entry?.label ?? `${dayIndex(date)}`}
                                            {available && (
                                                <span className="ml-0.5 text-[10px] text-slate-500">↗</span>
                                            )}
                                            {pending && (
                                                <span className="ml-0.5 text-[10px] text-slate-600">~</span>
                                            )}
                                        </span>
                                    )
                                }}
                                renderModal={(date) => {
                                    const entry = experiment.calendar?.days?.[toISO(date)]
                                    return entry ? (
                                        <>
                                            <p className="font-medium text-white">
                                                {entry.title ?? `Day ${dayIndex(date)}`}
                                            </p>
                                            {entry.note && (
                                                <p className="mt-2 text-slate-400">{entry.note}</p>
                                            )}
                                            {entry.href ? (
                                                <a
                                                    href={entry.href}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="group mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-white"
                                                >
                                                    <span className="text-slate-600 transition-transform group-hover:translate-x-1">
                                                        →
                                                    </span>
                                                    {entry.linkLabel ?? 'open related content'}
                                                </a>
                                            ) : entry.releaseDate ? (
                                                <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                                                    not released yet — expected{' '}
                                                    {formatDateLabel(toLocalDate(entry.releaseDate))}
                                                </p>
                                            ) : null}
                                        </>
                                    ) : (
                                        <p className="text-slate-400">
                                            Day {dayIndex(date)} — no log yet.
                                        </p>
                                    )
                                }}
                            />
                        </div>
                        {(() => {
                            const days = experiment.calendar?.days
                            const hasMedia = days
                                ? Object.values(days).some((d) => d.href || d.releaseDate)
                                : false
                            if (!hasMedia) return null
                            return (
                                <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                                    <span>
                                        <span className="text-slate-400">↗</span> available online
                                    </span>
                                    <span>
                                        <span className="text-slate-600">~</span> completed & scheduled
                                    </span>
                                </p>
                            )
                        })()}
                    </section>
                )}

                <section className="border-b border-dashed border-slate-800 py-10">
                    <SectionHeading>Log</SectionHeading>
                    <p className="mt-4 text-sm text-slate-500">
                        log: experiment in progress — field notes will land here.
                    </p>
                </section>

                <footer className="mt-auto border-t border-dashed border-slate-800 pt-6 text-xs text-slate-600">
                    mindset lab // kalen michael — rebuilt daily.
                </footer>
            </div>
        </main>
    )
}
