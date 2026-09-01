import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

const root = process.cwd()
const dist = join(root, 'dist')

const vite = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
})

function inject(html, appHtml) {
    return html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
}

function rebaseNested(html) {
    return html.split('./').join('../../')
}

try {
    const { default: App } = await vite.ssrLoadModule('/src/App.tsx')
    const { ExperimentPage, EXPERIMENTS } = await vite.ssrLoadModule('/src/Experiment.tsx')
    const { ExperimentsIndexPage } = await vite.ssrLoadModule('/src/Experiments.tsx')
    const { VaultPage } = await vite.ssrLoadModule('/src/Vault.tsx')

    const template = await readFile(join(dist, 'index.html'), 'utf8')

    await writeFile(
        join(dist, 'index.html'),
        inject(template, renderToString(createElement(App))),
    )

    const experimentsDir = join(dist, 'experiments')
    await mkdir(experimentsDir, { recursive: true })
    await writeFile(
        join(experimentsDir, 'index.html'),
        rebaseNested(inject(template, renderToString(createElement(ExperimentsIndexPage)))),
    )

    const vaultDir = join(dist, 'vault')
    await mkdir(vaultDir, { recursive: true })
    await writeFile(
        join(vaultDir, 'index.html'),
        rebaseNested(inject(template, renderToString(createElement(VaultPage)))),
    )

    for (const experiment of EXPERIMENTS) {
        const dir = join(dist, 'experiment', experiment.slug)
        await mkdir(dir, { recursive: true })
        const appHtml = renderToString(createElement(ExperimentPage, { experiment }))
        await writeFile(join(dir, 'index.html'), rebaseNested(inject(template, appHtml)))
    }

    console.log(
        `index.html + ${EXPERIMENTS.length} experiment page(s) + experiments index + vault prerendered`,
    )
} finally {
    await vite.close()
}