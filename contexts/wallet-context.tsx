"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WalletContextType {
  selectedProvider: any
  setSelectedProvider: (provider: any) => void
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
  account: string
  setAccount: (account: string) => void
  walletName: string
  setWalletName: (name: string) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [selectedProvider, setSelectedProvider] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState("")
  const [walletName, setWalletName] = useState("")

  return (
    <WalletContext.Provider
      value={{
        selectedProvider,
        setSelectedProvider,
        isConnected,
        setIsConnected,
        account,
        setAccount,
        walletName,
        setWalletName,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
