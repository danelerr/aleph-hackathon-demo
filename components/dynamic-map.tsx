"use client"

import dynamic from 'next/dynamic'
import { useMemo } from 'react'

interface DynamicMapProps {
  onPinClick: (incident: any) => void
  selectedFilter: string
}

export default function DynamicMap({ onPinClick, selectedFilter }: DynamicMapProps) {
  const Map = useMemo(() => dynamic(
    () => import('./leaflet-map'),
    { 
      loading: () => (
        <div className="flex-1 relative overflow-hidden">
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Cargando mapa...</p>
            </div>
          </div>
        </div>
      ),
      ssr: false
    }
  ), [])

  return <Map onPinClick={onPinClick} selectedFilter={selectedFilter} />
}
