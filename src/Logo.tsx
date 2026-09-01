export function Logo({ heading = false }: { heading?: boolean }) {
    const wordmark = (
        <>
            MINDSET LAB <span className="font-normal text-slate-600">//</span> KALEN MICHAEL
        </>
    )
    const wordmarkClass = 'text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl'
    return (
        <div>
            <p className="mb-6 text-xs text-slate-600">welcome to the experiment</p>
            {heading ? (
                <h1 className={wordmarkClass}>{wordmark}</h1>
            ) : (
                <p className={wordmarkClass}>{wordmark}</p>
            )}
        </div>
    )
}