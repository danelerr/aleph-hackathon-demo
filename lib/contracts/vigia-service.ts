import { ethers } from "ethers";
import { VIGIA_ABI, VIGIA_CONTRACT_CONFIG } from "./vigia-config.js";

// Tipos para MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Tipos TypeScript para nuestros datos
export interface Report {
  id: number;
  creator: string;
  latitude: string;
  longitude: string;
  imageHash: string;
  description: string;
  timestamp: number;
  status: string;
  confirmations: string[];
  category: string;
}

export interface ReportInput {
  latitude: string;
  longitude: string;
  imageHash: string;
  description: string;
  category: string;
}

/**
 * Hook para detectar y conectar con MetaMask
 */
export async function connectWallet(): Promise<{
  provider: ethers.BrowserProvider;
  signer: ethers.JsonRpcSigner;
  account: string;
} | null> {
  if (typeof window === "undefined" || !window.ethereum) {
    alert("Por favor instala MetaMask para usar esta aplicación");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Solicitar acceso a las cuentas
    await provider.send("eth_requestAccounts", []);
    
    const signer = await provider.getSigner();
    const account = await signer.getAddress();
    
    return { provider, signer, account };
  } catch (error) {
    console.error("Error conectando wallet:", error);
    alert("Error al conectar con MetaMask");
    return null;
  }
}

/**
 * Obtener instancia del contrato
 */
export async function getVigiaContract(network: "hardhat" | "liskSepolia" = "hardhat") {
  const walletConnection = await connectWallet();
  if (!walletConnection) throw new Error("No se pudo conectar la wallet");

  const { signer } = walletConnection;
  const contractAddress = VIGIA_CONTRACT_CONFIG.addresses[network];
  
  if (!contractAddress) {
    throw new Error(`Contrato no desplegado en la red ${network}`);
  }

  return new ethers.Contract(contractAddress, VIGIA_ABI, signer);
}

/**
 * Crear un nuevo reporte de incidencia
 */
export async function createReport(reportData: ReportInput, network: "hardhat" | "liskSepolia" = "hardhat"): Promise<{
  success: boolean;
  transactionHash?: string;
  error?: string;
}> {
  try {
    const contract = await getVigiaContract(network);
    
    // Validaciones básicas
    if (!reportData.latitude || !reportData.longitude) {
      return { success: false, error: "Ubicación requerida" };
    }
    if (!reportData.description) {
      return { success: false, error: "Descripción requerida" };
    }
    if (!reportData.category) {
      return { success: false, error: "Categoría requerida" };
    }

    console.log("Enviando reporte al contrato...", reportData);

    // Llamar a la función del contrato
    const tx = await contract.reportarIncidencia(
      reportData.latitude,
      reportData.longitude,
      reportData.imageHash || "", // Puede estar vacío si no hay imagen
      reportData.description,
      reportData.category
    );

    console.log("Transacción enviada:", tx.hash);
    
    // Esperar confirmación
    await tx.wait();
    
    console.log("Reporte creado exitosamente!");
    
    return {
      success: true,
      transactionHash: tx.hash
    };

  } catch (error: any) {
    console.error("Error creando reporte:", error);
    
    let errorMessage = "Error desconocido";
    if (error.reason) {
      errorMessage = error.reason;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Obtener todos los reportes del contrato
 */
export async function getAllReports(network: "hardhat" | "liskSepolia" = "hardhat"): Promise<Report[]> {
  try {
    const contract = await getVigiaContract(network);
    
    console.log("Obteniendo reportes del contrato...");
    
    const reports = await contract.getAllReports();
    
    console.log("Reportes obtenidos:", reports);
    
    // Convertir los datos del contrato a nuestro formato
    return reports.map((report: any) => ({
      id: Number(report.id),
      creator: report.creator,
      latitude: report.latitude,
      longitude: report.longitude,
      imageHash: report.imageHash,
      description: report.description,
      timestamp: Number(report.timestamp),
      status: report.status,
      confirmations: report.confirmations,
      category: report.category
    }));

  } catch (error) {
    console.error("Error obteniendo reportes:", error);
    return [];
  }
}

/**
 * Validar un reporte existente
 */
export async function validateReport(reportId: number, network: "hardhat" | "liskSepolia" = "hardhat"): Promise<{
  success: boolean;
  transactionHash?: string;
  error?: string;
}> {
  try {
    const contract = await getVigiaContract(network);
    
    console.log("Validando reporte ID:", reportId);
    
    const tx = await contract.validarReporte(reportId);
    
    console.log("Transacción de validación enviada:", tx.hash);
    
    await tx.wait();
    
    console.log("Reporte validado exitosamente!");
    
    return {
      success: true,
      transactionHash: tx.hash
    };

  } catch (error: any) {
    console.error("Error validando reporte:", error);
    
    let errorMessage = "Error desconocido";
    if (error.reason) {
      errorMessage = error.reason;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Obtener el total de reportes
 */
export async function getTotalReports(network: "hardhat" | "liskSepolia" = "hardhat"): Promise<number> {
  try {
    const contract = await getVigiaContract(network);
    
    const total = await contract.getTotalReports();
    
    return Number(total);

  } catch (error) {
    console.error("Error obteniendo total de reportes:", error);
    return 0;
  }
}

/**
 * Configurar la red en MetaMask
 */
export async function switchToLiskNetwork(): Promise<boolean> {
  if (typeof window === "undefined" || !window.ethereum) {
    return false;
  }

  try {
    const liskConfig = VIGIA_CONTRACT_CONFIG.networks.liskSepolia;
    
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${liskConfig.chainId.toString(16)}` }],
    });
    
    return true;
  } catch (error: any) {
    // Si la red no está agregada, la agregamos
    if (error.code === 4902) {
      try {
        const liskConfig = VIGIA_CONTRACT_CONFIG.networks.liskSepolia;
        
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${liskConfig.chainId.toString(16)}`,
            chainName: liskConfig.name,
            rpcUrls: [liskConfig.rpcUrl],
            blockExplorerUrls: [liskConfig.blockExplorer],
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
          }],
        });
        
        return true;
      } catch (addError) {
        console.error('Error agregando red Lisk:', addError);
        return false;
      }
    } else {
      console.error('Error cambiando a red Lisk:', error);
      return false;
    }
  }
}
