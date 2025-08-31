"use client"

import { useState } from "react"
import { connectWallet, getAllReports, createReport } from "../lib/contracts/vigia-client"
import { toast } from "sonner"

export default function BlockchainTest() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState("")
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    setLoading(true)
    try {
      const connection = await connectWallet()
      if (connection) {
        setIsConnected(true)
        setAccount(connection.account)
        toast.success("Wallet conectada!", {
          description: `Cuenta: ${connection.account.slice(0, 6)}...${connection.account.slice(-4)}`
        })
      } else {
        toast.error("Error conectando wallet")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error conectando wallet")
    } finally {
      setLoading(false)
    }
  }

  const handleGetReports = async () => {
    setLoading(true)
    try {
      const allReports = await getAllReports("hardhat")
      setReports(allReports)
      toast.success(`${allReports.length} reportes obtenidos del contrato`)
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error obteniendo reportes")
    } finally {
      setLoading(false)
    }
  }

  const handleTestReport = async () => {
    setLoading(true)
    try {
      const testReport = {
        latitude: "-12.0464",
        longitude: "-77.0428", 
        description: "Reporte de prueba desde el frontend",
        category: "Bache",
        imageHash: ""
      }

      const result = await createReport(testReport, "hardhat")
      
      if (result.success) {
        toast.success("¡Reporte de prueba creado!", {
          description: `Hash: ${result.transactionHash?.slice(0, 10)}...`
        })
        // Actualizar la lista de reportes
        handleGetReports()
      } else {
        toast.error("Error creando reporte", {
          description: result.error
        })
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error creando reporte de prueba")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border z-50 max-w-sm">
      <h3 className="font-bold mb-3">🧪 Prueba Blockchain</h3>
      
      <div className="space-y-2">
        {!isConnected ? (
          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Conectando..." : "Conectar Wallet"}
          </button>
        ) : (
          <>
            <div className="text-sm text-green-600 dark:text-green-400">
              ✅ Conectado: {account.slice(0, 6)}...{account.slice(-4)}
            </div>
            
            <button
              onClick={handleGetReports}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 text-sm"
            >
              {loading ? "Cargando..." : `Ver Reportes (${reports.length})`}
            </button>
            
            <button
              onClick={handleTestReport}
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50 text-sm"
            >
              {loading ? "Enviando..." : "Crear Reporte de Prueba"}
            </button>
          </>
        )}
      </div>

      {reports.length > 0 && (
        <div className="mt-3 max-h-32 overflow-y-auto">
          <h4 className="text-xs font-semibold mb-1">Reportes en el contrato:</h4>
          {reports.map((report) => (
            <div key={report.id} className="text-xs p-2 bg-gray-100 dark:bg-gray-700 rounded mb-1">
              <div>ID: {report.id}</div>
              <div>Categoría: {report.category}</div>
              <div>Estado: {report.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
