import { Fragment, useEffect, useState } from 'react'
import { MoveLeft } from 'lucide-react'
import content from './content.json'

const MENU = [
    { label: 'FEATURED', href: '#featured' },
    { label: 'VAULT', href: '#vault' },
    { label: 'ELSEWHERE', href: '#elsewhere' },
]

const NOTES: Note[] = content.notes as Note[]
const RESOURCES: Resource[] = content.resources as Resource[]

const THEME_KEY = 'mindset-lab-theme'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
    try {
        const stored = localStorage.getItem(THEME_KEY)
        if (stored === 'light' || stored === 'dark') return stored
    } catch {
        // fall through to system preference
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function SunIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
    )
}

function MoonIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
            aria-hidden="true"
        >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    )
}

function ThemeToggle({
    theme,
    onToggle,
}: {
    theme: Theme
    onToggle: () => void
}) {
    const next = theme === 'dark' ? 'light' : 'dark'
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={`Switch to ${next} mode`}
            title={`Switch to ${next} mode`}
            className="fixed right-6 top-6 z-10 grid size-9 place-items-center rounded-full border border-slate-700 text-slate-400 transition-colors hover:border-slate-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 sm:right-8 sm:top-8"
        >
            {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
        </button>
    )
}

type CategoryId = 'RAW' | 'LAB' | 'TOOLKIT'

type Category = {
    name: string
    desc: string
    color: string
}

type Pillar = {
    num: string
    id: CategoryId
    href: string
}

type Note = {
    no: string
    date: string
    tag: CategoryId
    title: string
    desc?: string
    href: string
}

type ResourceTagId = 'DOWNLOAD' | 'TOOLKIT' | 'READING'

type ResourceTag = {
    name: string
    desc: string
    color: string
}

type Resource = {
    no: string
    tag: ResourceTagId
    title: string
    desc: string
    href: string
}

const CATEGORIES: Record<CategoryId, Category> = {
    RAW: {
        name: 'RAW',
        desc: 'Unfiltered notes on career rebuilding, identity shifts, and navigating high-stakes transitions.',
        color: 'text-sky-400',
    },
    LAB: {
        name: 'LAB',
        desc: 'Active experiments in mental models, discipline systems, and human performance.',
        color: 'text-violet-400',
    },
    TOOLKIT: {
        name: 'TOOLKIT',
        desc: 'Practical execution frameworks, routines, and physical endurance data (e.g., marathon blocks).',
        color: 'text-amber-400',
    },
}

const PILLARS: Pillar[] = [
    { num: '01', id: 'RAW', href: 'https://kalenmichael.substack.com' },
    { num: '02', id: 'LAB', href: 'https://kalenmichael.substack.com' },
    { num: '03', id: 'TOOLKIT', href: 'https://kalenmichael.substack.com' },
]

const RESOURCE_TAGS: Record<ResourceTagId, ResourceTag> = {
    DOWNLOAD: {
        name: 'DOWNLOAD',
        desc: 'Drop-in tools and printable trackers.',
        color: 'text-sky-400',
    },
    TOOLKIT: {
        name: 'TOOLKIT',
        desc: 'Systems and routines you can run immediately.',
        color: 'text-amber-400',
    },
    READING: {
        name: 'READING',
        desc: 'Books and papers behind the mental models.',
        color: 'text-violet-400',
    },
}

function App() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme)

    useEffect(() => {
        document.documentElement.classList.toggle('light', theme === 'light')
        try {
            localStorage.setItem(THEME_KEY, theme)
        } catch {
            // storage unavailable — theme still applies for the session
        }
    }, [theme])

    useEffect(() => {
        try {
            if (localStorage.getItem(THEME_KEY)) return
        } catch {
            return
        }
        const mq = window.matchMedia('(prefers-color-scheme: light)')
        const onSystemChange = (event: MediaQueryListEvent) =>
            setTheme(event.matches ? 'light' : 'dark')
        mq.addEventListener('change', onSystemChange)
        return () => mq.removeEventListener('change', onSystemChange)
    }, [])

    return (
        <main className="min-h-svh bg-slate-950 font-mono text-slate-300 selection:bg-slate-300 selection:text-slate-950">
            <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
            <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-6 py-12 sm:px-8">
                {/* Header */}
                <header className="border-b border-dashed border-slate-800 pb-10">
                    <nav aria-label="Section" className="mb-8 flex flex-wrap items-center gap-1 pr-12 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                        {MENU.map((item, index) => (
                            <Fragment key={item.href}>
                                {index > 0 && <span className="text-slate-700">/</span>}
                                <a href={item.href} className="px-2 transition-colors hover:text-white">
                                    {item.label}
                                </a>
                            </Fragment>
                        ))}
                    </nav>
                    <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                        MINDSET LAB <span className="font-normal text-slate-600">//</span> KALEN MICHAEL
                    </h1>
                    <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-400">
                        A public log of experiments in mindset, physical endurance, and operational
                        discipline. Real frameworks, zero wishy-washy fluff.
                    </p>

                </header>

                {/* Substack outpost */}
                <section className="border-b border-dashed border-slate-800 py-10">
                    <p className="mb-6 text-xs text-slate-600">
                        Welcome to the experiment.
                    </p>
                    <a
                        href="https://kalenmichael.substack.com"
                        className="group inline-flex items-center gap-3 border border-slate-700 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-slate-100 hover:bg-slate-100 hover:text-slate-950"
                    >
                        <span className="text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-slate-950">
                            →
                        </span>
                        Read the full archive on Substack
                    </a>

                </section>

                {/* Core pillars */}
                <section className="border-b border-dashed border-slate-800 py-10">
                    <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                        <span className="text-slate-700">##</span> Core Pillars
                    </h2>
                    <div className="mt-6">
                        {PILLARS.map((pillar) => {
                            const category = CATEGORIES[pillar.id]
                            return (
                                <div
                                    key={pillar.id}
                                    className="group flex flex-col gap-1 border-b border-slate-800/70 py-4 sm:flex-row sm:items-baseline sm:gap-4"
                                >
                                    <span className="w-8 shrink-0 text-xs font-bold tracking-wider text-slate-600">
                                        {pillar.num}
                                    </span>
                                    <span className={`w-28 shrink-0 font-medium ${category.color}`}>
                                        {category.name}
                                    </span>
                                    <span className="text-sm text-slate-500">{category.desc}</span>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Field notes */}
                <section id="featured" className="border-b border-dashed border-slate-800 py-10">
                    <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                        <span className="text-slate-700">##</span> Featured Notes
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-slate-500">
                        A curated log of high-signal experiments and foundational dispatches.
                    </p>
                    <div className="mt-6">
                        {NOTES.map((note) => {
                            const category = CATEGORIES[note.tag] ?? {
                                name: note.tag,
                                desc: '',
                                color: 'text-slate-400',
                            }
                            return (
                                <a
                                    key={note.no}
                                    href={note.href}
                                    className="group flex flex-col gap-2 border-b border-slate-800/70 py-5"
                                >
                                    <div className="flex items-baseline gap-4 text-sm">
                                        <span className="text-xs font-bold tracking-wider text-slate-600">
                                            {note.no}
                                        </span>
                                        <span className="text-xs text-slate-500">{note.date}</span>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${category.color}`}>
                                            [{category.name}]
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-2 font-medium">
                                        <span className="text-white transition-colors group-hover:text-slate-300">
                                            {note.title}
                                        </span>
                                        <MoveLeft
                                            aria-hidden="true"
                                            className="size-4 translate-x-2 text-slate-500 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-slate-400 group-hover:opacity-100"
                                        />
                                    </span>
                                    {note.desc && (
                                        <span className="text-sm leading-relaxed text-slate-500">
                                            {note.desc}
                                        </span>
                                    )}
                                </a>
                            )
                        })}
                    </div>

                </section>

                {/* Vault */}
                <section id="vault" className="border-b border-dashed border-slate-800 py-10">
                    <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                        <span className="text-slate-700">##</span> Vault
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-slate-500">
                        A collection of resources and tools: field-tested and battle-worn.
                    </p>
                    <div className="mt-6">
                        {RESOURCES.map((resource) => {
                            const tag = RESOURCE_TAGS[resource.tag] ?? {
                                name: resource.tag,
                                desc: '',
                                color: 'text-slate-400',
                            }
                            return (
                                <a
                                    key={resource.no}
                                    href={resource.href}
                                    className="group flex flex-col gap-2 border-b border-slate-800/70 py-5"
                                >
                                    <div className="flex items-baseline gap-4 text-sm">
                                        <span className="text-xs font-bold tracking-wider text-slate-600">
                                            {resource.no}
                                        </span>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${tag.color}`}>
                                            [{tag.name}]
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-2 font-medium">
                                        <span className="text-white transition-colors group-hover:text-slate-300">
                                            {resource.title}
                                        </span>
                                        <MoveLeft
                                            aria-hidden="true"
                                            className="size-4 translate-x-2 text-slate-500 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-slate-400 group-hover:opacity-100"
                                        />
                                    </span>
                                    <span className="text-sm leading-relaxed text-slate-500">
                                        {resource.desc}
                                    </span>
                                </a>
                            )
                        })}
                    </div>
                </section>

                {/* Elsewhere */}
                <section id="elsewhere" className="border-b border-dashed border-slate-800 py-10">
                    <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                        <span className="text-slate-700">##</span> Elsewhere
                    </h2>
                    <div className="flex flex-wrap gap-x-10 gap-y-4 pt-6">
                        <a
                            href="https://youtube.com/@kalenmichael"
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                        >
                            <span className="text-slate-700 group-hover:text-slate-400">↗</span>
                            youtube <span className="text-slate-600">/@kalenmichael</span>
                        </a>
                        <a
                            href="https://instagram.com/kalenmichael"
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                        >
                            <span className="text-slate-700 group-hover:text-slate-400">↗</span>
                            instagram <span className="text-slate-600">/@kalenmichael</span>
                        </a>
                        <a
                            href="https://tiktok.com/@kalenmichael"
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                        >
                            <span className="text-slate-700 group-hover:text-slate-400">↗</span>
                            tiktok <span className="text-slate-600">/@kalenmichael</span>
                        </a>
                        <a
                            href="https://x.com/kalenmichael"
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                        >
                            <span className="text-slate-700 group-hover:text-slate-400">↗</span>
                            x <span className="text-slate-600">/@kalenmichael</span>
                        </a>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-auto border-t border-dashed border-slate-800 pt-6 text-xs text-slate-600">
                    mindset-lab // kalen michael — rebuilt daily.
                </footer>
            </div>
        </main>
    )
}

export default App
