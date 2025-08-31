import { ethers } from "ethers"

/**
 * Cambiar a la red Lisk Sepolia
 */
export async function switchToLiskSepolia(provider: ethers.BrowserProvider) {
  try {
    // Verificar red actual
    const network = await provider.getNetwork()
    
    // Si ya estamos en Lisk Sepolia, no hacer nada
    if (network.chainId === 4202n) {
      console.log("Ya estás en Lisk Sepolia")
      return { success: true }
    }

    console.log(`Cambiando de red ${network.chainId} a Lisk Sepolia (4202)...`)
    
    try {
      await provider.send("wallet_switchEthereumChain", [
        { chainId: "0x106a" } // 4202 en hexadecimal
      ])
      console.log("Red cambiada exitosamente a Lisk Sepolia")
      return { success: true }
      
    } catch (switchError: any) {
      console.log("Error al cambiar red:", switchError)
      
      // Si la red no está agregada (error 4902), la agregamos
      if (switchError.code === 4902 || switchError.message?.includes("Unrecognized chain ID")) {
        console.log("Red no encontrada, agregando Lisk Sepolia...")
        
        try {
          await provider.send("wallet_addEthereumChain", [
            {
              chainId: "0x106a",
              chainName: "Lisk Sepolia Testnet",
              rpcUrls: ["https://rpc.sepolia-api.lisk.com"],
              nativeCurrency: {
                name: "Sepolia Ether", 
                symbol: "ETH",
                decimals: 18
              },
              blockExplorerUrls: ["https://sepolia-blockscout.lisk.com"]
            }
          ])
          
          console.log("Red Lisk Sepolia agregada exitosamente")
          
          // Después de agregar, intentar cambiar nuevamente
          await provider.send("wallet_switchEthereumChain", [
            { chainId: "0x106a" }
          ])
          
          console.log("Cambiado a red Lisk Sepolia después de agregar")
          return { success: true }
          
        } catch (addError: any) {
          console.error("Error agregando red Lisk Sepolia:", addError)
          
          // Si el usuario rechazó agregar la red
          if (addError.code === 4001 || addError.code === 'ACTION_REJECTED') {
            return { 
              success: false, 
              error: "Necesitas agregar la red Lisk Sepolia para usar Vigia",
              userRejected: true
            }
          }
          
          return { 
            success: false, 
            error: `No se pudo agregar la red Lisk Sepolia: ${addError.message}` 
          }
        }
      } else {
        // Si el usuario rechazó cambiar de red
        if (switchError.code === 4001 || switchError.code === 'ACTION_REJECTED') {
          return { 
            success: false, 
            error: "Necesitas cambiar a la red Lisk Sepolia para usar Vigia",
            userRejected: true
          }
        }
        
        return { 
          success: false, 
          error: `No se pudo cambiar a la red Lisk Sepolia: ${switchError.message}` 
        }
      }
    }
  } catch (error: any) {
    console.error("Error general cambiando red:", error)
    return { 
      success: false, 
      error: `Error inesperado: ${error.message}` 
    }
  }
}
