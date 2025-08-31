"use client"

import { useState, useEffect } from "react"
import { Wallet, X, RefreshCw } from "lucide-react"

interface WalletSelectorProps {
  isOpen: boolean
  onClose: () => void
  onWalletSelected: (provider: any, walletName: string) => void
}

interface DetectedWallet {
  name: string
  provider: any
}

export default function WalletSelector({ isOpen, onClose, onWalletSelected }: WalletSelectorProps) {
  const [detecting, setDetecting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [wallets, setWallets] = useState<DetectedWallet[]>([])

  const detectWallets = (): DetectedWallet[] => {
    const wallets: DetectedWallet[] = []

    // @ts-ignore
    if (typeof window !== "undefined") {
      console.log('🔍 Detectando wallets disponibles...');
      console.log('window.ethereum:', window.ethereum);
      
      // @ts-ignore
      if (window.ethereum?.providers && Array.isArray(window.ethereum.providers)) {
        console.log('📱 Múltiples providers detectados:', window.ethereum.providers.length);
        // @ts-ignore
        window.ethereum.providers.forEach((provider: any, index: number) => {
          console.log(`Provider ${index}:`, {
            isMetaMask: provider.isMetaMask,
            isRabby: provider.isRabby,
            isCoinbaseWallet: provider.isCoinbaseWallet,
            isTrust: provider.isTrust
          });
          
          if (provider.isMetaMask && !provider.isRabby) {
            wallets.push({ name: "MetaMask", provider })
          } else if (provider.isRabby) {
            wallets.push({ name: "Rabbit", provider })
          } else if (provider.isCoinbaseWallet) {
            wallets.push({ name: "Coinbase Wallet", provider })
          } else if (provider.isTrust) {
            wallets.push({ name: "Trust Wallet", provider })
          } else {
            wallets.push({ name: `Wallet ${index + 1}`, provider })
          }
        })
      } else {
        // Verificar wallet única
        // @ts-ignore
        if (window.ethereum) {
          console.log('📱 Provider único detectado');
          // @ts-ignore
          if (window.ethereum.isMetaMask && !window.ethereum.isRabby) {
            // @ts-ignore
            wallets.push({ name: "MetaMask", provider: window.ethereum })
          // @ts-ignore
          } else if (window.ethereum.isRabby) {
            // @ts-ignore
            wallets.push({ name: "Rabbit", provider: window.ethereum })
          // @ts-ignore
          } else if (window.ethereum.isCoinbaseWallet) {
            // @ts-ignore
            wallets.push({ name: "Coinbase Wallet", provider: window.ethereum })
          // @ts-ignore
          } else if (window.ethereum.isTrust) {
            // @ts-ignore
            wallets.push({ name: "Trust Wallet", provider: window.ethereum })
          } else {
            // @ts-ignore
            wallets.push({ name: "Extensión de navegador", provider: window.ethereum })
          }
        }
        
        // Verificar wallets en objetos globales separados
        // @ts-ignore
        if (window.rabby && !wallets.find(w => w.name === "Rabbit")) {
          console.log('🐰 Rabbit detectado en window.rabby');
          // @ts-ignore
          wallets.push({ name: "Rabbit", provider: window.rabby })
        }
        
        // @ts-ignore
        if (window.coinbaseWalletExtension && !wallets.find(w => w.name === "Coinbase Wallet")) {
          console.log('💙 Coinbase detectado en window.coinbaseWalletExtension');
          // @ts-ignore
          wallets.push({ name: "Coinbase Wallet", provider: window.coinbaseWalletExtension })
        }
      }
    }
    
    console.log('✅ Wallets detectadas:', wallets.map(w => w.name));
    return wallets
  }

  useEffect(() => {
    if (isOpen) {
      setWallets(detectWallets())
    }
  }, [isOpen])

  const refreshWallets = () => {
    setRefreshing(true)
    setTimeout(() => {
      setWallets(detectWallets())
      setRefreshing(false)
    }, 1000)
  }

  const handleWalletClick = async (wallet: DetectedWallet) => {
    setDetecting(true)
    try {
      onWalletSelected(wallet.provider, wallet.name)
    } catch (error) {
      console.error("Error seleccionando wallet:", error)
    } finally {
      setDetecting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold">Conectar Wallet</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {wallets.length > 0 ? (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Selecciona la wallet que deseas usar:
              </p>
              {wallets.map((wallet, index) => (
                <button
                  key={index}
                  onClick={() => handleWalletClick(wallet)}
                  disabled={detecting}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {wallet.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{wallet.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {wallet.name === "MetaMask" && "Extensión de navegador"}
                      {wallet.name === "Rabbit" && "Extensión de navegador optimizada"}
                      {wallet.name === "Coinbase Wallet" && "Wallet de Coinbase"}
                      {wallet.name.includes("Wallet") && wallet.name !== "MetaMask" && wallet.name !== "Rabbit" && wallet.name !== "Coinbase Wallet" && "Wallet detectada"}
                      {wallet.name === "Extensión de navegador" && "Wallet compatible"}
                    </p>
                  </div>
                  {detecting && (
                    <div className="ml-auto w-4 h-4 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </button>
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No se detectaron wallets instaladas
              </p>
              <button
                onClick={refreshWallets}
                disabled={refreshing}
                className="mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Buscando...' : 'Buscar wallets'}
              </button>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Instala MetaMask, Rabbit, o cualquier wallet compatible
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Vigia funciona con cualquier wallet compatible con Ethereum
          </p>
        </div>
      </div>
    </div>
  )
}
