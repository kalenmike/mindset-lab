import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import type { APIContext } from 'astro'
import { buildFeedItems } from '../../../lib/rss'

export async function getStaticPaths() {
    const entries = await getCollection('blogs')
    const blogNames = entries
        .filter((entry) => !entry.id.includes('/'))
        .map((entry) => entry.id)
    return [...new Set(blogNames)].map((name) => ({ params: { name } }))
}

export async function GET(context: APIContext) {
    const { name } = context.params
    const site = context.site?.href ?? 'https://kalenmichael.com'

    const entries = await getCollection('blogs')
    const meta = entries.find((entry) => !entry.id.includes('/') && entry.id === name)

    const articles = entries
        .filter((entry) => entry.id.includes('/') && entry.id.startsWith(`${name}/`))
        .sort((a, b) => (b.data.date ?? '').localeCompare(a.data.date ?? ''))

    const items = await buildFeedItems(articles, site)

    return rss({
        title: `${meta?.data.title ?? name} | The Kalen Michael Experiment`,
        description: meta?.data.description ?? '',
        site,
        items,
        xmlns: { media: 'http://search.yahoo.com/mrss/' },
        customData: '<language>en-us</language>',
    })
}