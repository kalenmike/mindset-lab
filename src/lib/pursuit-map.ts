import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { unzipSync } from 'fflate'
import { XMLParser } from 'fast-xml-parser'

export type PursuitPoint = {
    group: string
    label: string
    note?: string
    night: number
    lat: number
    lon: number
}

export function loadPursuitMap(kmlPath: string): PursuitPoint[] {
    const buf = readFileSync(join(process.cwd(), kmlPath))
    const unzipped = unzipSync(new Uint8Array(buf))
    const kmlText = new TextDecoder().decode(unzipped['doc.kml'])
    const parser = new XMLParser({ ignoreAttributes: false })
    const doc = parser.parse(kmlText)
    const folders = doc.kml?.Document?.Folder ?? []
    const folderList = Array.isArray(folders) ? folders : [folders]

    const points: PursuitPoint[] = []
    for (const folder of folderList) {
        const group = typeof folder?.name === 'string' ? folder.name.trim() : ''
        const marks = folder?.Placemark ?? []
        const markList = Array.isArray(marks) ? marks : [marks]
        for (const pm of markList) {
            const coords = typeof pm?.Point?.coordinates === 'string' ? pm.Point.coordinates.trim() : ''
            const [lon, lat] = coords.split(',').map(Number)
            if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue
            const label = typeof pm?.name === 'string' ? pm.name.trim() : ''
            const nightMatch = label.match(/(\d+)/)
            points.push({
                group,
                label,
                note: typeof pm?.description === 'string' && pm.description.trim() ? pm.description.trim() : undefined,
                night: nightMatch ? Number(nightMatch[1]) : 0,
                lat,
                lon,
            })
        }
    }
    return points
}