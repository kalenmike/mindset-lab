import { MoveLeft } from 'lucide-react'
import content from './content.json'
import { RESOURCE_TAGS, type ResourceTagId } from './categories'
import { PageTemplate } from './Layout'

type Resource = {
    no: string
    tag: ResourceTagId
    title: string
    desc: string
    href: string
}

const RESOURCES = content.resources as Resource[]

export function VaultPage() {
    const nav = (
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1 pr-12 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            <a href="../" className="group inline-flex items-center gap-2 px-2 transition-colors hover:text-white">
                <span className="text-slate-700 transition-transform group-hover:-translate-x-1">←</span>
                MINDSET LAB
            </a>
            <span className="text-slate-700">/</span>
            <span className="px-2 text-slate-500">VAULT</span>
        </nav>
    )

    return (
        <PageTemplate nav={nav}>
            <section className="border-b border-dashed border-slate-800 py-10">
                <p className="mb-6 text-xs text-slate-600">
                    the archive
                </p>
                <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                    VAULT <span className="font-normal text-slate-600">//</span>{' '}
                    <span className="text-slate-300">Resources</span>
                </h1>
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-400">
                    A collection of resources and tools: field-tested and battle-worn.
                </p>
            </section>

            <section className="border-b border-dashed border-slate-800 py-10">
                <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    <span className="text-slate-700">##</span> All Resources
                </h2>
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
        </PageTemplate>
    )
}