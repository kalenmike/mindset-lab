import { z } from 'astro/zod'
import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'

const experimentDay = z.object({
    label: z.string().optional(),
    title: z.string().optional(),
    note: z.string().optional(),
    href: z.string().optional(),
    linkLabel: z.string().optional(),
    releaseDate: z.string().optional(),
})

const experiments = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/experiments' }),
    schema: z.object({
        title: z.string(),
        subtitle: z.string().optional().default(''),
        tagline: z.string(),
        status: z.enum(['LIVE', 'COMPLETE', 'HIDDEN']),
        start: z.string(),
        duration: z.string(),
        tag: z.enum(['RAW', 'LAB', 'TOOLKIT']),
        description: z.string(),
        protocol: z.array(z.string()),
        href: z.string(),
        featured: z.boolean().optional().default(false),
        order: z.number(),
        calendar: z
            .object({
                start: z.string(),
                end: z.string(),
                days: z.record(z.string(), experimentDay).optional(),
            })
            .optional(),
    }),
})

const notes = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
    schema: z.object({
        no: z.string(),
        date: z.string(),
        tag: z.enum(['RAW', 'LAB', 'TOOLKIT']),
        title: z.string(),
        desc: z.string().optional(),
        href: z.string(),
        experiment: z.string().optional(),
    }),
})

const resources = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
    schema: z.object({
        no: z.string(),
        tag: z.enum(['DOWNLOAD', 'TOOLKIT', 'READING']),
        title: z.string(),
        desc: z.string(),
        href: z.string(),
    }),
})

export const collections = { experiments, notes, resources }