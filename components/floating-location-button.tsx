"use client"

import { useState } from "react"
import { useDarkMode } from "../app/page"
import { MapPin, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface FloatingLocationButtonProps {
  onLocationObtained: (location: { lat: number; lng: number }) => void
}

export default function FloatingLocationButton({ onLocationObtained }: FloatingLocationButtonProps) {
  const { isDarkMode } = useDarkMode()
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [hasLocation, setHasLocation] = useState(false)

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización")
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setHasLocation(true)
        setIsGettingLocation(false)
        onLocationObtained(location)
        toast.success("Ubicación obtenida correctamente")
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error)
        setIsGettingLocation(false)
        setHasLocation(false)
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Acceso a ubicación denegado")
            break
          case error.POSITION_UNAVAILABLE:
            toast.error("Ubicación no disponible")
            break
          case error.TIMEOUT:
            toast.error("Tiempo de espera agotado")
            break
          default:
            toast.error("Error obteniendo ubicación")
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  return (
    <div className="fixed bottom-28 right-6 z-50">
      <button
        onClick={getCurrentLocation}
        disabled={isGettingLocation}
        className={`relative w-14 h-14 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center group overflow-hidden ${
          hasLocation
            ? isDarkMode
              ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
              : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500"
            : isDarkMode
            ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600"
            : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500"
        } hover:scale-110 hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
      >
        {/* Ripple effect background */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

        {/* Icon */}
        {isGettingLocation ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : (
          <MapPin className={`w-6 h-6 text-white transition-transform duration-200 ${hasLocation ? 'scale-110' : ''}`} />
        )}

        {/* Pulse animation for when getting location */}
        {isGettingLocation && (
          <div className="absolute inset-0 rounded-full border-2 border-gray-400 opacity-75 animate-ping" />
        )}
      </button>
      
      {/* Tooltip */}
      <div className={`absolute right-16 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-opacity duration-200 opacity-0 group-hover:opacity-100 pointer-events-none ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-gray-900 text-white"
      }`}>
        {isGettingLocation ? "Obteniendo ubicación..." : hasLocation ? "Ubicación obtenida" : "Obtener mi ubicación"}
      </div>
    </div>
  )
}
