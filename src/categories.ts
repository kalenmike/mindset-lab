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
        desc: 'The crude operational log. Behind-the-scenes friction, execution data, and the real-time cost of maintaining self-trust under load.',
        color: 'text-sky-400',
    },
    LAB: {
        name: 'LAB',
        desc: 'Where discipline meets stress-testing. Structured challenges designed to push mindset and endurance, measuring what happens when commitment is forced under pressure.',
        color: 'text-violet-400',
    },
    TOOLKIT: {
        name: 'TOOLKIT',
        desc: "Battle-tested frameworks and systems extracted from the field. No abstract theory, just operational routines and data captured as they prove themselves in the real world.",
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
