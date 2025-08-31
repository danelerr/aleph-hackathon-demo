"use client"

import { useState } from "react"
import { X, Copy, ExternalLink, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface NetworkHelpModalProps {
  isOpen: boolean
  onClose: () => void
  walletName?: string
}

export default function NetworkHelpModal({ isOpen, onClose, walletName = "tu wallet" }: NetworkHelpModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!isOpen) return null

  const networkConfig = {
    name: "Lisk Sepolia Testnet",
    chainId: "4202",
    chainIdHex: "0x106a",
    rpc: "https://rpc.sepolia-api.lisk.com",
    currency: "ETH",
    explorer: "https://sepolia-blockscout.lisk.com"
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success(`${field} copiado al portapapeles`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold">Configurar Red Manualmente</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Para usar Vigia, necesitas agregar la red Lisk Sepolia a {walletName}. 
            Copia los siguientes datos y agrégalos manualmente en la configuración de redes de tu wallet:
          </p>

          <div className="space-y-3">
            {[
              { label: "Nombre de la Red", value: networkConfig.name, field: "Nombre" },
              { label: "Chain ID", value: networkConfig.chainId, field: "Chain ID" },
              { label: "Chain ID (Hex)", value: networkConfig.chainIdHex, field: "Chain ID Hex" },
              { label: "RPC URL", value: networkConfig.rpc, field: "RPC URL" },
              { label: "Símbolo de Moneda", value: networkConfig.currency, field: "Símbolo" },
              { label: "Explorador", value: networkConfig.explorer, field: "Explorador" }
            ].map(({ label, value, field }) => (
              <div key={field} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {label}
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-sm font-mono break-all">
                    {value}
                  </code>
                  <button
                    onClick={() => copyToClipboard(value, field)}
                    className="p-1.5 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                    title={`Copiar ${field}`}
                  >
                    {copiedField === field ? (
                      <span className="text-xs">✓</span>
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                  Instrucciones generales:
                </p>
                <ol className="list-decimal list-inside text-blue-600 dark:text-blue-400 space-y-1">
                  <li>Abre la configuración de tu wallet</li>
                  <li>Busca "Redes" o "Networks"</li>
                  <li>Selecciona "Agregar Red" o "Add Network"</li>
                  <li>Completa los campos con los datos de arriba</li>
                  <li>Guarda y selecciona la nueva red</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => window.open(networkConfig.explorer, '_blank')}
              className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Ver Explorador
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
