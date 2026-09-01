import { Fragment } from 'react'
import { MoveLeft } from 'lucide-react'
import content from './content.json'
import { CATEGORIES, type CategoryId } from './categories'
import { EXPERIMENTS } from './Experiment'
import { PageTemplate } from './Layout'
import { Status } from './Status'

const MENU = [
    { label: 'FEATURED', href: '#featured' },
    { label: 'EXPERIMENTS', href: 'experiments/' },
    { label: 'VAULT', href: 'vault/' },
    { label: 'ELSEWHERE', href: '#elsewhere' },
]

const NOTES: Note[] = content.notes as Note[]

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

const PILLARS: Pillar[] = [
    { num: '01', id: 'RAW', href: 'https://kalenmichael.substack.com' },
    { num: '02', id: 'LAB', href: 'https://kalenmichael.substack.com' },
    { num: '03', id: 'TOOLKIT', href: 'https://kalenmichael.substack.com' },
]

function App() {
    const nav = (
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
    )

    return (
        <PageTemplate nav={nav} logoHeading>
            {/* Hero / mission */}
            <section className="border-b border-dashed border-slate-800 py-10">
                <p className="max-w-xl text-sm leading-relaxed text-slate-400">
                    A public log of experiments in mindset, physical endurance, and operational
                    discipline. Real frameworks, zero wishy-washy fluff.
                </p>

                {/* Substack outpost */}
                <a
                    href="https://kalenmichael.substack.com"
                    className="mt-10 group inline-flex items-center gap-3 border border-slate-700 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-slate-100 hover:bg-slate-100 hover:text-slate-950"
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

            {/* Featured experiments */}
            <section id="experiments" className="border-b border-dashed border-slate-800 py-10">
                <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    <span className="text-slate-700">##</span> Featured Experiments
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                    Field studies worth watching right now.
                </p>
                <div className="mt-6">
                    {EXPERIMENTS.filter((experiment) => experiment.featured).map((experiment) => {
                        const category = CATEGORIES[experiment.tag] ?? {
                            name: experiment.tag,
                            desc: '',
                            color: 'text-slate-400',
                        }
                        return (
                            <a
                                key={experiment.slug}
                                href={`experiment/${experiment.slug}/`}
                                className="group flex flex-col gap-2 border-b border-slate-800/70 py-5"
                            >
                                <div className="flex items-baseline gap-4 text-sm">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${category.color}`}>
                                        [{category.name}]
                                    </span>
                                    <span className="text-xs text-slate-500">{experiment.duration}</span>
                                    <Status value={experiment.status} />
                                </div>
                                <span className="flex items-center gap-2 font-medium">
                                    <span className="text-white transition-colors group-hover:text-slate-300">
                                        {experiment.title}
                                        {experiment.subtitle ? (
                                            <>
                                                {' '}
                                                <span className="text-slate-600">//</span>{' '}
                                                {experiment.subtitle}
                                            </>
                                        ) : null}
                                    </span>
                                    <MoveLeft
                                        aria-hidden="true"
                                        className="size-4 translate-x-2 text-slate-500 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-slate-400 group-hover:opacity-100"
                                    />
                                </span>
                                <span className="text-sm leading-relaxed text-slate-500">
                                    {experiment.tagline}
                                </span>
                            </a>
                        )
                    })}
                </div>
                <a
                    href="experiments/"
                    className="group mt-8 inline-flex items-center gap-3 border border-slate-700 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-slate-100 hover:bg-slate-100 hover:text-slate-950"
                >
                    <span className="text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-slate-950">
                        →
                    </span>
                    View all experiments
                </a>
            </section>

            {/* Featured notes */}
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
        </PageTemplate>
    )
}

export default App