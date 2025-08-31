"use client"

import { useDarkMode } from "../app/page"
import { useState } from "react"

interface IncidentModalProps {
  isOpen: boolean
  onClose: () => void
  incident: any
}

export default function IncidentModal({ isOpen, onClose, incident }: IncidentModalProps) {
  const { isDarkMode } = useDarkMode()
  const [isConfirming, setIsConfirming] = useState(false)

  if (!isOpen || !incident) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Sin verificar":
        return "bg-gray-500 text-white"
      case "Necesita confirmación":
        return "bg-yellow-500 text-black"
      case "Verificado":
        return "bg-green-500 text-white"
      case "Rechazado":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const handleConfirm = async () => {
    setIsConfirming(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Confirmando incidencia...", incident.id)
    setIsConfirming(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-[fadeInUp_0.3s_ease-out]"
      onClick={onClose}
    >
      <div
        className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} 
          border rounded-2xl p-6 w-full max-w-lg shadow-2xl transform transition-all duration-300 
          animate-[scaleIn_0.3s_ease-out] max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Detalles del Reporte</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Incident Photo with enhanced styling */}
          <div className="relative w-full h-64 bg-gray-200 rounded-xl overflow-hidden group">
            <img
              src={incident.image || "/placeholder.svg"}
              alt="Incident"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Status badge overlay */}
            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium shadow-lg ${getStatusBadge(incident.status)}`}
              >
                {incident.status}
              </span>
            </div>
          </div>

          {/* Description with better typography */}
          <div className="space-y-3">
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Descripción</h3>
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed text-base`}>
              {incident.description}
            </p>
          </div>

          {/* Enhanced status and stats section */}
          <div className={`p-4 rounded-xl ${isDarkMode ? "bg-gray-700" : "bg-gray-50"} space-y-3`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Confirmaciones
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {incident.confirmations}
                  </span>
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Estado Actual</p>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusBadge(incident.status)}`}
                  >
                    {incident.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Location info if available */}
            {incident.location && (
              <div className="pt-2 border-t border-gray-600">
                <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Ubicación</p>
                <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} mt-1`}>{incident.location}</p>
              </div>
            )}
          </div>

          {/* Enhanced action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 btn-hover-scale ${
                isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              Cerrar
            </button>

            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 btn-hover-scale relative overflow-hidden ${
                isConfirming ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
              } text-white shadow-lg hover:shadow-xl`}
            >
              {isConfirming ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Confirmando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Confirmar Reporte</span>
                </div>
              )}

              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
