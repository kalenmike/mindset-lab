import type { ReactNode } from 'react'
import { Logo } from './Logo'
import { ThemeToggle, useTheme } from './theme'

const SOCIALS = [
    { label: 'youtube', href: 'https://youtube.com/@kalenmichael' },
    { label: 'instagram', href: 'https://instagram.com/kalenmichael' },
    { label: 'tiktok', href: 'https://tiktok.com/@kalenmichael' },
    { label: 'x', href: 'https://x.com/kalenmichael' },
]

export function Header({
    nav,
    logo = true,
    logoHeading = false,
}: {
    nav: ReactNode
    logo?: boolean
    logoHeading?: boolean
}) {
    return (
        <header className="border-b border-dashed border-slate-800 pb-10">
            {nav}
            {logo && <Logo heading={logoHeading} />}
        </header>
    )
}

export function Footer() {
    return (
        <>
            <section id="elsewhere" className="border-b border-dashed border-slate-800 py-10">
                <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    <span className="text-slate-700">##</span> Elsewhere
                </h2>
                <div className="flex flex-wrap gap-x-10 gap-y-4 pt-6">
                    {SOCIALS.map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                        >
                            <span className="text-slate-700 group-hover:text-slate-400">↗</span>
                            {social.label} <span className="text-slate-600">/@kalenmichael</span>
                        </a>
                    ))}
                </div>
            </section>
            <footer className="mt-auto border-t border-dashed border-slate-800 pt-6 text-xs text-slate-600">
                mindset lab // kalen michael — rebuilt daily.
            </footer>
        </>
    )
}

export function PageTemplate({
    nav,
    children,
    logo = true,
    logoHeading = false,
}: {
    nav: ReactNode
    children: ReactNode
    logo?: boolean
    logoHeading?: boolean
}) {
    const { theme, toggleTheme } = useTheme()
    return (
        <main className="min-h-svh bg-slate-950 font-mono text-slate-300 selection:bg-slate-300 selection:text-slate-950">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-6 py-12 sm:px-8">
                <Header nav={nav} logo={logo} logoHeading={logoHeading} />
                <div className="flex-1">{children}</div>
                <Footer />
            </div>
        </main>
    )
}