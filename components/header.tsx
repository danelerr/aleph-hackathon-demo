"use client"

import { Moon, Sun, Menu, X, Wallet, LogOut } from "lucide-react"
import { useDarkMode } from "../app/page"
import { useState } from "react"
import { connectWallet } from "../lib/contracts/vigia-client"
import { toast } from "sonner"
import { ethers } from "ethers"
import WalletSelector from "./wallet-selector"
import { switchToLiskSepolia } from "../lib/contracts/network-utils"
import { useWallet } from "../contexts/wallet-context"

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const { 
    selectedProvider, 
    setSelectedProvider, 
    isConnected, 
    setIsConnected, 
    account, 
    setAccount, 
    walletName, 
    setWalletName 
  } = useWallet()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showWalletSelector, setShowWalletSelector] = useState(false)

  const handleConnectWallet = async () => {
    // Mostrar selector de wallets en lugar de conectar directamente
    setShowWalletSelector(true)
  }

  const handleWalletSelected = async (selectedProvider: any, selectedWalletName: string) => {
    setShowWalletSelector(false)
    setIsConnecting(true)
    
    try {
      // Guardar el proveedor seleccionado
      setSelectedProvider(selectedProvider)
      
      // Usar el proveedor seleccionado
      const provider = new ethers.BrowserProvider(selectedProvider)
      
      // Solicitar acceso a las cuentas
      await provider.send("eth_requestAccounts", [])
      
      const signer = await provider.getSigner()
      const account = await signer.getAddress()
      
      setIsConnected(true)
      setAccount(account)
      setWalletName(selectedWalletName)
      toast.success(`${selectedWalletName} conectada: ${account.slice(0, 6)}...${account.slice(-4)}`)
      
    } catch (error: any) {
      console.error("Error conectando wallet:", error)
      
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        toast.error("Conexión cancelada por el usuario")
      } else if (error.message?.includes('No injected provider found')) {
        toast.error("Por favor instala una wallet (MetaMask, Rabbit, Coinbase, etc.)")
      } else {
        toast.error(`Error conectando wallet: ${error.message}`)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnectWallet = () => {
    setIsConnected(false)
    setAccount("")
    setWalletName("")
    toast.success("Wallet desconectada")
  }

  return (
    <header
      className={`${isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"} border-b transition-all duration-200`}
    >
      <div className="px-3 py-1 sm:px-4 sm:py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6">
            <svg width="100%" height="100%" viewBox="0 0 50 51" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M25 2.125C29.9727 2.125 34.7415 4.14007 38.2578 7.72656C41.7741 11.3132 43.75 16.1777 43.75 21.25C43.75 36.1236 25.0035 48.8726 25 48.875C25 48.875 6.25 36.125 6.25 21.25C6.25 16.1777 8.22588 11.3132 11.7422 7.72656C15.2585 4.14007 20.0273 2.125 25 2.125ZM25 14C18 14 14 22 14 22C14 22 18 30 25 30C32 30 36 22 36 22C36 22 32 14 25 14Z"
                fill={isDarkMode ? "white" : "#111827"}
              />
              <path
                d="M25 25C26.6569 25 28 23.6569 28 22C28 20.3431 26.6569 19 25 19C23.3431 19 22 20.3431 22 22C22 23.6569 23.3431 25 25 25Z"
                fill={isDarkMode ? "#111827" : "white"}
              />
              <path
                d="M14 22C14 22 18 14 25 14C32 14 36 22 36 22C36 22 32 30 25 30C18 30 14 22 14 22Z"
                stroke={isDarkMode ? "#111827" : "white"}
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className={`text-base sm:text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Vigia</h1>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className={`p-1.5 rounded-lg ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"} transition-all duration-200 hover:shadow-lg`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isConnected ? (
            <div className="flex items-center gap-2">
              <div className="bg-green-500 text-white px-3 py-1.5 text-sm rounded-lg flex items-center gap-1.5">
                <Wallet className="w-3 h-3" />
                <span className="hidden md:inline">{walletName}:</span>
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
              <button
                onClick={handleDisconnectWallet}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 flex items-center gap-1.5"
                title="Desconectar wallet"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Desconectar</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-sm rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isConnecting ? (
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Wallet className="w-3 h-3" />
              )}
              {isConnecting ? "Conectando..." : "Conectar Wallet"}
            </button>
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`sm:hidden p-1.5 rounded-lg ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"} transition-all duration-200`}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          className={`sm:hidden border-t ${isDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-white"} px-3 py-2`}
        >
          <div className="flex flex-col gap-2">
            <button
              onClick={toggleDarkMode}
              className={`flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"} transition-all duration-200`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="text-sm">{isDarkMode ? "Modo Claro" : "Modo Oscuro"}</span>
            </button>

            {isConnected ? (
              <div className="flex flex-col gap-2">
                <div className="bg-green-500 text-white px-3 py-2 rounded-lg flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm">{account.slice(0, 6)}...{account.slice(-4)}</span>
                </div>
                <button
                  onClick={handleDisconnectWallet}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-all duration-200 text-sm flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Desconectar Wallet
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isConnecting ? (
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Wallet className="w-4 h-4" />
                )}
                {isConnecting ? "Conectando..." : "Conectar Wallet"}
              </button>
            )}
          </div>
        </div>
      )}
      
      <WalletSelector 
        isOpen={showWalletSelector}
        onClose={() => setShowWalletSelector(false)}
        onWalletSelected={handleWalletSelected}
      />
    </header>
  )
}
