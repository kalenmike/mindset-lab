const STATUS_STYLES: Record<string, string> = {
    LIVE: 'text-red-400 animate-blink',
    COMPLETE: 'text-green-400',
}

export function Status({ value }: { value: string }) {
    const style = STATUS_STYLES[value] ?? 'text-slate-500'
    return <span className={`text-xs ${style}`}>{value}</span>
}