"use client"

import { useState, useEffect } from "react"
import { useDarkMode } from "../app/page"
import { createReport, type ReportInput } from "../lib/contracts/vigia-client"
import { toast } from "sonner"
import { MapPin, Loader2 } from "lucide-react"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  location?: { lat: number; lng: number } // Ubicación del click en el mapa
}

export default function ReportModal({ isOpen, onClose, location }: ReportModalProps) {
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isDarkMode } = useDarkMode()

  // Categorías disponibles
  const categories = [
    "Bache",
    "Semáforo dañado", 
    "Alcantarilla abierta",
    "Alumbrado público",
    "Señalización",
    "Basura acumulada",
    "Otro"
  ]

  const handleClose = () => {
    setDescription("")
    setCategory("")
    setFile(null)
    onClose()
  }

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Por favor describe la incidencia")
      return
    }

    if (!category) {
      toast.error("Por favor selecciona una categoría")
      return
    }

    if (!location) {
      toast.error("Por favor obtén tu ubicación usando el botón flotante")
      return
    }

    setIsSubmitting(true)

    try {
      // Preparar datos del reporte
      const reportData: ReportInput = {
        latitude: location.lat.toString(),
        longitude: location.lng.toString(),
        description: description.trim(),
        category,
        imageHash: "", // Por ahora sin IPFS
      }

      // Crear reporte en el contrato
      const result = await createReport(reportData, "hardhat")

      if (result.success) {
        toast.success("¡Reporte enviado a la blockchain exitosamente!", {
          description: `Hash: ${result.transactionHash?.slice(0, 10)}...`
        })
        
        // Limpiar formulario y cerrar modal
        setDescription("")
        setCategory("")
        setFile(null)
        handleClose()
      } else {
        toast.error("Error al enviar el reporte", {
          description: result.error
        })
      }

    } catch (error) {
      console.error("Error enviando reporte:", error)
      toast.error("Error inesperado al enviar el reporte")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className={`${isDarkMode ? "bg-gray-800/90 text-white" : "bg-white/95 text-gray-900"} rounded-xl p-6 w-full max-w-md modal-enter shadow-2xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200/50"} backdrop-blur-md`}
      >
        <h2 className="text-xl font-bold text-center mb-6">Reportar Nueva Incidencia</h2>

        <div className="space-y-4">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed ${isDarkMode ? "border-gray-600 hover:border-gray-500" : "border-gray-300 hover:border-gray-400"} rounded-lg p-8 text-center transition-colors duration-200`}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="photo-upload"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <svg
                className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                {file ? file.name : "Toca para subir una foto"}
              </p>
            </label>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full p-3 ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} rounded-lg border-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-sm font-medium mb-2">Descripción de la incidencia</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-3 ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} rounded-lg border-none focus:ring-2 focus:ring-blue-500 resize-none`}
              rows={4}
              placeholder="Describe la incidencia en detalle..."
            />
          </div>

          {/* Location Section */}
          <div>
            <label className="block text-sm font-medium mb-2">Ubicación</label>
            
            {location ? (
              <div className={`p-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg border-2 border-green-500`}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <p className="text-sm font-medium text-green-500">Ubicación obtenida</p>
                </div>
                <p className="text-xs opacity-75">
                  Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                </p>
              </div>
            ) : (
              <div className={`p-4 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg border-2 border-dashed ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
                <div className="text-center">
                  <MapPin className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                  <p className="text-sm opacity-75 mb-3">Presiona el botón flotante de ubicación</p>
                  <p className="text-xs opacity-50">Necesitas obtener tu ubicación antes de enviar el reporte</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className={`flex-1 py-3 px-4 ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"} rounded-lg transition-colors duration-200 disabled:opacity-50`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !location}
              className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Enviando..." : "Enviar a Blockchain"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
