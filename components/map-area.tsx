"use client"

import dynamic from 'next/dynamic'
import { useDarkMode } from "@/app/page"

interface MapAreaProps {
  onPinClick: (incident: any) => void
  selectedFilter: string
}

// Importación dinámica del componente de mapa
const LeafletMap = dynamic(
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
    ssr: false // Esto es crucial - evita el renderizado del servidor
  }
)

export default function MapArea({ onPinClick, selectedFilter }: MapAreaProps) {
  return <LeafletMap onPinClick={onPinClick} selectedFilter={selectedFilter} />
}
