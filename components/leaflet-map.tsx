"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import { useDarkMode } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Navigation } from "lucide-react"

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface LeafletMapProps {
  onPinClick: (incident: any) => void
  selectedFilter: string
}

const incidents = [
  {
    id: 1,
    lat: -34.6037,
    lng: -58.3816,
    status: "Sin verificar",
    color: "#6B7280",
    description: "Bache en la vía principal",
    confirmations: 0,
    image: "/pothole-in-street.png",
  },
  {
    id: 2,
    lat: -34.6118,
    lng: -58.396,
    status: "Necesita confirmación",
    color: "#F59E0B",
    description: "Semáforo dañado en intersección",
    confirmations: 2,
    image: "/broken-traffic-light.png",
  },
  {
    id: 3,
    lat: -34.6158,
    lng: -58.3731,
    status: "Verificado",
    color: "#10B981",
    description: "Alcantarilla sin tapa",
    confirmations: 5,
    image: "/open-manhole-cover.png",
  },
]

// Create custom icons for different incident statuses
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  })
}

// Component to handle geolocation
function LocationButton() {
  const map = useMap()
  const [isLocating, setIsLocating] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocalización no está soportada por este navegador.')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const newLocation: [number, number] = [latitude, longitude]
        setUserLocation(newLocation)
        map.setView(newLocation, 16)
        setIsLocating(false)
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error)
        alert('No se pudo obtener tu ubicación. Asegúrate de permitir el acceso a la ubicación.')
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  return (
    <>
      <Button
        onClick={handleLocate}
        disabled={isLocating}
        className="absolute top-20 right-3 z-[1000] p-2 h-10 w-10"
        variant="outline"
        size="sm"
      >
        <Navigation className={`h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} />
      </Button>
      
      {userLocation && (
        <Marker 
          position={userLocation}
          icon={L.divIcon({
            className: 'user-location-icon',
            html: `
              <div style="
                background-color: #3b82f6;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                animation: pulse 2s infinite;
              "></div>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })}
        >
          <Popup>
            <div className="text-sm">
              <strong>Tu ubicación</strong>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  )
}

export default function LeafletMap({ onPinClick, selectedFilter }: LeafletMapProps) {
  const { isDarkMode } = useDarkMode()

  const filteredIncidents = incidents.filter((incident) => {
    if (selectedFilter === "all") return true
    if (selectedFilter === "pending") return incident.status === "Necesita confirmación"
    if (selectedFilter === "verified") return incident.status === "Verificado"
    if (selectedFilter === "rejected") return incident.status === "Rechazado"
    return true
  })

  // Default center for Buenos Aires
  const defaultCenter: [number, number] = [-34.6037, -58.3816]

  return (
    <div className="flex-1 relative overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={isDarkMode 
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />
        
        {/* Incident markers */}
        {filteredIncidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.lat, incident.lng]}
            icon={createCustomIcon(incident.color)}
            eventHandlers={{
              click: () => onPinClick(incident)
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong>{incident.description}</strong>
                <br />
                <span className="text-xs text-gray-600">
                  Estado: {incident.status}
                </span>
                <br />
                <span className="text-xs text-gray-600">
                  Confirmaciones: {incident.confirmations}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Location button */}
        <LocationButton />
      </MapContainer>

      {/* Filter indicator */}
      {selectedFilter !== "all" && (
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm z-[1000] ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          } shadow-lg`}
        >
          Filtro:{" "}
          {selectedFilter === "pending" ? "Pendiente" : selectedFilter === "verified" ? "Verificado" : "Rechazado"}
        </div>
      )}
    </div>
  )
}
