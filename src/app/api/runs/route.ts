import { NextRequest, NextResponse } from 'next/server'

export type SkiRun = {
  osm_id: string
  name: string | null
  difficulty: string | null
  geometry: [number, number][] // [lat, lon]
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') ?? '')
  const lon = parseFloat(searchParams.get('lon') ?? '')

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing lat/lon' }, { status: 400 })
  }

  const delta = 0.1 // ~11km buffer
  const bbox = `${lat - delta},${lon - delta},${lat + delta},${lon + delta}`

  const query = `
    [out:json][timeout:30];
    (
      way["piste:type"="downhill"](${bbox});
    );
    out body;
    >;
    out skel qt;
  `

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      next: { revalidate: 3600 }, // cache 1 hour
    })

    if (!res.ok) throw new Error('Overpass API error')

    const data = await res.json()

    // Build node map for geometry
    const nodeMap = new Map<number, [number, number]>()
    for (const el of data.elements) {
      if (el.type === 'node') {
        nodeMap.set(el.id, [el.lat, el.lon])
      }
    }

    const runs: SkiRun[] = []
    for (const el of data.elements) {
      if (el.type !== 'way') continue
      const tags = el.tags ?? {}
      const geometry: [number, number][] = (el.nodes ?? [])
        .map((nid: number) => nodeMap.get(nid))
        .filter(Boolean)

      runs.push({
        osm_id: `way/${el.id}`,
        name: tags.name ?? tags['piste:name'] ?? null,
        difficulty: tags['piste:difficulty'] ?? null,
        geometry,
      })
    }

    return NextResponse.json({ runs })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch runs' }, { status: 500 })
  }
}
