import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

const root = process.cwd()
const distIndex = join(root, 'dist', 'index.html')

const vite = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.tsx')
  const appHtml = renderToString(createElement(App))

  const template = await readFile(distIndex, 'utf8')
  const rendered = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  await writeFile(distIndex, rendered)

  console.log('index.html prerendered to static HTML')
} finally {
  await vite.close()
}