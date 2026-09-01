import { useEffect, useState } from 'react'

export const THEME_KEY = 'mindset-lab-theme'

export type Theme = 'light' | 'dark'

export function getInitialTheme(): Theme {
    try {
        const stored = localStorage.getItem(THEME_KEY)
        if (stored === 'light' || stored === 'dark') return stored
    } catch {
        // fall through to system preference
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function SunIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
    )
}

function MoonIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
            aria-hidden="true"
        >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    )
}

export function ThemeToggle({
    theme,
    onToggle,
}: {
    theme: Theme
    onToggle: () => void
}) {
    const next = theme === 'dark' ? 'light' : 'dark'
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={`Switch to ${next} mode`}
            title={`Switch to ${next} mode`}
            className="fixed right-6 top-6 z-10 grid size-9 place-items-center rounded-full border border-slate-700 text-slate-400 transition-colors hover:border-slate-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 sm:right-8 sm:top-8"
        >
            {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
        </button>
    )
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>('dark')
    const [manualChoice, setManualChoice] = useState(false)

    useEffect(() => {
        if (manualChoice) return
        setTheme(getInitialTheme())
    }, [manualChoice])

    useEffect(() => {
        if (manualChoice) return
        const mq = window.matchMedia('(prefers-color-scheme: light)')
        const onSystemChange = (event: MediaQueryListEvent) =>
            setTheme(event.matches ? 'light' : 'dark')
        mq.addEventListener('change', onSystemChange)
        return () => mq.removeEventListener('change', onSystemChange)
    }, [manualChoice])

    useEffect(() => {
        document.documentElement.classList.toggle('light', theme === 'light')
        if (manualChoice) {
            try {
                localStorage.setItem(THEME_KEY, theme)
            } catch {
                // storage unavailable — theme still applies for the session
            }
        }
    }, [theme, manualChoice])

    const toggleTheme = () => {
        setManualChoice(true)
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return { theme, toggleTheme }
}