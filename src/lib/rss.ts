import { getContainerRenderer } from '@astrojs/mdx/container-renderer'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { loadRenderers } from 'astro:container'
import { render, type CollectionEntry } from 'astro:content'
import { transform, walk } from 'ultrahtml'
import sanitize from 'ultrahtml/transformers/sanitize'
import type { RSSFeedItem } from '@astrojs/rss'

type BlogEntry = CollectionEntry<'blogs'>

export async function buildFeedItems(entries: BlogEntry[], site: string): Promise<RSSFeedItem[]> {
    const renderers = await loadRenderers([getContainerRenderer()])
    const container = await AstroContainer.create({ renderers })

    const baseUrl = site.replace(/\/$/, '')

    const items: RSSFeedItem[] = []
    for (const entry of entries) {
        const [name, slug] = entry.id.split('/')
        const { Content } = await render(entry)
        const raw = await container.renderToString(Content)
        const content = await transform(raw.replace(/^<!DOCTYPE html>/, ''), [
            async (node) => {
                await walk(node, (node) => {
                    if (node.attributes) {
                        for (const key of Object.keys(node.attributes)) {
                            if (key.startsWith('data-astro-cid')) {
                                delete node.attributes[key]
                            }
                        }
                    }
                    if (node.name === 'a' && node.attributes.href?.startsWith('/')) {
                        node.attributes.href = baseUrl + node.attributes.href
                    }
                    if (node.name === 'img' && node.attributes.src?.startsWith('/')) {
                        node.attributes.src = baseUrl + node.attributes.src
                    }
                })
                return node
            },
            sanitize({ dropElements: ['script', 'style'] }),
        ])

        items.push({
            title: entry.data.title,
            link: `/blog/${name}/${slug}/`,
            pubDate: entry.data.date ? new Date(entry.data.date) : undefined,
            description: entry.data.description,
            content,
        })
    }

    return items
}