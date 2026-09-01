import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ExperimentPage, EXPERIMENTS } from './Experiment.tsx'
import { ExperimentsIndexPage } from './Experiments.tsx'
import { VaultPage } from './Vault.tsx'

const pathname = window.location.pathname
const isExperimentsIndex = /\/experiments\/?$/.test(pathname)
const isVault = /\/vault\/?$/.test(pathname)
const slugMatch = pathname.match(/\/experiment\/([^/]+)/)
const experiment =
    (slugMatch && EXPERIMENTS.find((entry) => entry.slug === slugMatch[1])) ??
    null

let page
if (isExperimentsIndex) {
    page = <ExperimentsIndexPage />
} else if (isVault) {
    page = <VaultPage />
} else if (experiment) {
    page = <ExperimentPage experiment={experiment} />
} else {
    page = <App />
}

hydrateRoot(
    document.getElementById('root')!,
    <StrictMode>{page}</StrictMode>,
)