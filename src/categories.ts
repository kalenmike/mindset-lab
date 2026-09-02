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
        desc: 'How I think. The public diary of the rebuild. Wins, losses, behind-the-scenes friction, and raw vulnerability as I log what it actually costs to earn back self-trust from zero.',
        color: 'text-sky-400',
    },
    LAB: {
        name: 'LAB',
        desc: 'How I Test. Self-trust experiments run in public. Pushing past comfort zones and testing discipline through brutal challenges to see what happens when you commit every week.',
        color: 'text-violet-400',
    },
    TOOLKIT: {
        name: 'TOOLKIT',
        desc: "What Works. Frameworks, routines, and data extracted from the experiments. No theory, just tools and systems captured as they prove themselves in the field. Hard proof over quick fixes.",
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
