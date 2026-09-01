import { MoveLeft } from 'lucide-react'
import { EXPERIMENTS } from './Experiment'
import { CATEGORIES } from './categories'
import { PageTemplate } from './Layout'
import { Status } from './Status'

export function ExperimentsIndexPage() {
    const nav = (
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1 pr-12 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            <a href="../" className="group inline-flex items-center gap-2 px-2 transition-colors hover:text-white">
                <span className="text-slate-700 transition-transform group-hover:-translate-x-1">←</span>
                MINDSET LAB
            </a>
            <span className="text-slate-700">/</span>
            <span className="px-2 text-slate-500">EXPERIMENTS</span>
        </nav>
    )

    return (
        <PageTemplate nav={nav}>
            <section className="border-b border-dashed border-slate-800 py-10">
                <p className="mb-6 text-xs text-slate-600">
                    the archive
                </p>
                <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                    EXPERIMENTS <span className="font-normal text-slate-600">//</span>{' '}
                    <span className="text-slate-300">Index</span>
                </h1>
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-400">
                    Every field study, past and present — each with its own protocol and log.
                </p>
            </section>

            <section className="border-b border-dashed border-slate-800 py-10">
                <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    <span className="text-slate-700">##</span> All Experiments
                </h2>
                <div className="mt-6">
                    {EXPERIMENTS.map((experiment) => {
                        const category = CATEGORIES[experiment.tag] ?? {
                            name: experiment.tag,
                            desc: '',
                            color: 'text-slate-400',
                        }
                        return (
                            <a
                                key={experiment.slug}
                                href={`../experiment/${experiment.slug}/`}
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
            </section>
        </PageTemplate>
    )
}