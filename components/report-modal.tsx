"use client"

import { useState, useEffect } from "react"
import { useDarkMode } from "../app/page"
import { createReport, type ReportInput } from "../lib/contracts/vigia-client"
import { toast } from "sonner"
import { MapPin, Loader2, Upload, CheckCircle, X } from "lucide-react"
import { create } from "@storacha/client"
import { IPFS_CONFIG, isValidImageFile } from "../lib/ipfs-config"
import NetworkHelpModal from "./network-help-modal"
import { useWallet } from "../contexts/wallet-context"

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
  const [isUploading, setIsUploading] = useState(false)
  const [imageHash, setImageHash] = useState("")
  const [imagePreview, setImagePreview] = useState<string>("")
  const [client, setClient] = useState<any>(null)
  const [showNetworkHelp, setShowNetworkHelp] = useState(false)
  const { isDarkMode } = useDarkMode()
  const { selectedProvider } = useWallet()

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

  // Inicializar cliente de Storacha
  useEffect(() => {
    const initClient = async () => {
      try {
        const w3Client = await create()
        setClient(w3Client)
        
        console.log('Cliente de Storacha inicializado')
        
        // Intentar usar el espacio existente
        try {
          await w3Client.setCurrentSpace(IPFS_CONFIG.SPACE_DID)
          console.log('Espacio configurado:', IPFS_CONFIG.SPACE_DID)
        } catch (spaceError) {
          console.warn('No se pudo configurar el espacio automáticamente:', spaceError)
          // El usuario tendrá que configurar el espacio manualmente
        }
        
      } catch (error) {
        console.error('Error inicializando Storacha:', error)
        toast.error('Error inicializando almacenamiento IPFS')
      }
    }
    
    if (isOpen) {
      initClient()
    }
  }, [isOpen])

  // Función para preparar imagen (vista previa)
  const handleImageSelection = (selectedFile: File) => {
    if (!isValidImageFile(selectedFile)) {
      toast.error("Archivo no válido. Solo se permiten imágenes menores a 5MB")
      return
    }

    setFile(selectedFile)
    
    // Crear vista previa inmediatamente
    const previewUrl = URL.createObjectURL(selectedFile)
    setImagePreview(previewUrl)
    
    toast.success("¡Imagen preparada! Se subirá cuando envíes el reporte.")
  }

  const handleClose = () => {
    // Limpiar vista previa para evitar memory leaks
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setDescription("")
    setCategory("")
    setFile(null)
    setImageHash("")
    setImagePreview("")
    setIsUploading(false)
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
      let finalImageHash = ""
      
      // Si hay un archivo, subirlo a IPFS primero
      if (file && client) {
        console.log(`Subiendo ${file.name} a IPFS antes de enviar a blockchain...`)
        setIsUploading(true)
        
        try {
          const cid = await client.uploadFile(file)
          finalImageHash = cid.toString()
          setImageHash(finalImageHash)
          console.log('Imagen subida a IPFS:', finalImageHash)
          toast.success("¡Imagen subida a IPFS exitosamente!")
        } catch (ipfsError) {
          console.error("Error subiendo a IPFS:", ipfsError)
          toast.error("Error subiendo imagen a IPFS")
          setIsSubmitting(false)
          setIsUploading(false)
          return
        } finally {
          setIsUploading(false)
        }
      }

      // Preparar datos del reporte
      const reportData: ReportInput = {
        latitude: location.lat.toString(),
        longitude: location.lng.toString(),
        description: description.trim(),
        category,
        imageHash: finalImageHash,
      }

      console.log("Enviando reporte a blockchain:", reportData)
      console.log("Usando proveedor:", selectedProvider ? "Wallet seleccionada" : "Sin wallet")

      // Crear reporte en el contrato usando el proveedor seleccionado
      const result = await createReport(reportData, "liskSepolia", selectedProvider)

      if (result.success) {
        toast.success("¡Reporte enviado a la blockchain exitosamente!", {
          description: `Hash: ${result.transactionHash?.slice(0, 10)}...`
        })
        
        // Limpiar formulario y cerrar modal
        handleClose()
      } else {
        toast.error("Error al enviar el reporte", {
          description: result.error
        })
        
        // Si es un error de red, mostrar ayuda
        if (result.error?.includes("chain") || result.error?.includes("network") || result.error?.includes("4202")) {
          setShowNetworkHelp(true)
        }
      }

    } catch (error) {
      console.error("Error enviando reporte:", error)
      toast.error("Error inesperado al enviar el reporte")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className={`${isDarkMode ? "bg-gray-800/70 text-white" : "bg-white/80 text-gray-900"} rounded-xl p-6 w-full max-w-md modal-enter shadow-2xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200/50"} backdrop-blur-lg`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Reportar Nueva Incidencia</h2>
          <button
            onClick={handleClose}
            className={`p-1 rounded-lg ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* File Upload Area with Preview */}
          <div>
            <label className="block text-sm font-medium mb-2">Fotografía (opcional)</label>
            <div
              className={`border-2 border-dashed ${
                imagePreview || imageHash
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                  : isDarkMode ? "border-gray-600 hover:border-gray-500" : "border-gray-300 hover:border-gray-400"
              } rounded-lg p-4 text-center transition-colors duration-200`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="photo-upload"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0]
                  if (selectedFile) {
                    handleImageSelection(selectedFile)
                  }
                }}
                disabled={isUploading || !client}
              />
              
              {imagePreview ? (
                <div className="space-y-3">
                  <img 
                    src={imagePreview} 
                    alt="Vista previa" 
                    className="w-32 h-32 object-cover rounded-lg mx-auto"
                  />
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {file?.name} - Listo para subir
                  </p>
                  <label htmlFor="photo-upload" className="inline-block">
                    <button 
                      type="button"
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      Cambiar imagen
                    </button>
                  </label>
                </div>
              ) : isUploading ? (
                <div className="flex flex-col items-center py-4">
                  <Loader2 className="w-8 h-8 mx-auto mb-2 text-blue-500 animate-spin" />
                  <p className="text-blue-500">Subiendo a IPFS...</p>
                </div>
              ) : imageHash ? (
                <div className="flex flex-col items-center py-4">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-green-500 font-medium">¡Imagen en blockchain!</p>
                  <p className="text-xs mt-1 opacity-75 break-all">CID: {imageHash.slice(0, 30)}...</p>
                </div>
              ) : (
                <label htmlFor="photo-upload" className="cursor-pointer block py-4">
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                  <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-sm`}>
                    {!client ? "Inicializando almacenamiento..." : "Toca para subir una foto"}
                  </p>
                </label>
              )}
            </div>
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
              disabled={isSubmitting || isUploading}
              className={`flex-1 py-3 px-4 ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"} rounded-lg transition-colors duration-200 disabled:opacity-50`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !location || isUploading}
              className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isUploading ? "Subiendo..." : "Enviando..."}
                </>
              ) : (
                "Enviar a Blockchain"
              )}
            </button>
          </div>
        </div>
      </div>
      
      <NetworkHelpModal 
        isOpen={showNetworkHelp}
        onClose={() => setShowNetworkHelp(false)}
        walletName="tu wallet"
      />
    </div>
  )
}
