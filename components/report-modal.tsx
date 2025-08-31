"use client"

import { useState } from "react"
import { useDarkMode } from "../app/page"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const { isDarkMode } = useDarkMode()

  if (!isOpen) return null

  const handleSubmit = () => {
    // Simulate blockchain submission
    console.log("Enviando reporte a la blockchain...", { description, file })
    onClose()
    setDescription("")
    setFile(null)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div
        className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-lg p-6 w-full max-w-md modal-enter`}
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

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className={`flex-1 py-3 px-4 ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"} rounded-lg transition-colors duration-200`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:shadow-lg"
            >
              Enviar Reporte a la Blockchain
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
