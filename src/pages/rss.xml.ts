import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import type { APIContext } from 'astro'
import { buildFeedItems } from '../lib/rss'

export async function GET(context: APIContext) {
    const site = context.site?.href ?? 'https://kalenmichael.com'

    const entries = await getCollection('blogs')
    const articles = entries
        .filter((entry) => entry.id.includes('/'))
        .sort((a, b) => (b.data.date ?? '').localeCompare(a.data.date ?? ''))

    const items = await buildFeedItems(articles, site, { blogCategory: true })

    return rss({
        title: 'The Kalen Michael Experiment',
        description:
            'A public log of experiments in mindset, physical endurance, and operational discipline. Real frameworks, zero wishy-washy fluff.',
        site,
        items,
        xmlns: { media: 'http://search.yahoo.com/mrss/' },
        customData: '<language>en-us</language>',
    })
}