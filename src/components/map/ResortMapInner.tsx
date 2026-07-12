'use client'

import { useEffect, useRef } from 'react'
import type { SkiRun } from '@/app/api/runs/route'

const DIFFICULTY_COLOR: Record<string, string> = {
  novice:       '#4ade80', // green
  easy:         '#60a5fa', // blue
  intermediate: '#f97316', // red
  advanced:     '#1e1e1e', // black
  expert:       '#1e1e1e',
  freeride:     '#a855f7', // purple
}

type Props = {
  lat: number
  lon: number
  runs: SkiRun[]
  selectedIds: Set<string>
  onToggle: (run: SkiRun) => void
}

export function ResortMapInner({ lat, lon, runs, selectedIds, onToggle }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<ReturnType<typeof import('leaflet')['map']> | null>(null)
  const layersRef = useRef<Map<string, unknown>>(new Map())

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    import('leaflet').then((L) => {
      // Fix default icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(containerRef.current!).setView([lat, lon], 13)

      // Base: CartoDB dark
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        maxZoom: 19,
      }).addTo(map)

      // OpenSnowMap piste overlay
      L.tileLayer('https://tiles.opensnowmap.org/pistes/{z}/{x}/{y}.png', {
        opacity: 0.8,
        attribution: '© OpenSnowMap',
        maxZoom: 18,
      }).addTo(map)

      mapRef.current = map
    })

    const layers = layersRef.current
    return () => {
      mapRef.current?.remove()
      mapRef.current = null
      layers.clear()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Draw / update run polylines
  useEffect(() => {
    if (!mapRef.current || !runs.length) return

    import('leaflet').then((L) => {
      const map = mapRef.current!

      // Remove old layers
      layersRef.current.forEach((layer) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map.removeLayer(layer as any)
      })
      layersRef.current.clear()

      runs.forEach((run) => {
        if (run.geometry.length < 2) return
        const isSelected = selectedIds.has(run.osm_id)
        const color = DIFFICULTY_COLOR[run.difficulty ?? ''] ?? '#94a3b8'

        const poly = L.polyline(run.geometry, {
          color: isSelected ? '#facc15' : color,
          weight: isSelected ? 5 : 3,
          opacity: isSelected ? 1 : 0.7,
        })

        poly.on('click', () => onToggle(run))

        if (run.name) {
          poly.bindTooltip(run.name, { sticky: true })
        }

        poly.addTo(map)
        layersRef.current.set(run.osm_id, poly)
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runs, selectedIds])

  return <div ref={containerRef} className="w-full h-full rounded-xl overflow-hidden" />
}
