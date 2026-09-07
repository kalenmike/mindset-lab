import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    site: 'https://kalenmichael.com',
    output: 'static',
    integrations: [sitemap(), mdx()],
    vite: {
        plugins: [tailwindcss()],
    },
})