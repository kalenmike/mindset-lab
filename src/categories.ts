export type CategoryId = 'RAW' | 'LAB' | 'TOOLKIT'

export type Category = {
    name: string
    desc: string
    color: string
}

export type ResourceTagId = 'DOWNLOAD' | 'TOOLKIT' | 'READING'

export type ResourceTag = {
    name: string
    desc: string
    color: string
}

export const CATEGORIES: Record<CategoryId, Category> = {
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

export const RESOURCE_TAGS: Record<ResourceTagId, ResourceTag> = {
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