// Configuración del contrato Vigia
export const VIGIA_CONTRACT_CONFIG = {
  // Direcciones del contrato en diferentes redes
  addresses: {
    hardhat: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    localhost: "0x5fbdb2315678afecb367f032d93f642f64180aa3", 
    liskSepolia: "0x9aD20ACF1E3592efF473B510603f5f647994cE9b",
  },
  
  // Configuración de redes
  networks: {
    hardhat: {
      chainId: 31337,
      name: "Hardhat Network",
      rpcUrl: "http://127.0.0.1:8545",
    },
    liskSepolia: {
      chainId: 4202,
      name: "Lisk Sepolia Testnet",
      rpcUrl: "https://rpc.sepolia-api.lisk.com",
      blockExplorer: "https://sepolia-blockscout.lisk.com",
    },
  },
} as const;

// ABI simplificado del contrato Vigia (solo las funciones que necesitamos)
export const VIGIA_ABI = [
  // Función para crear reportes
  {
    "type": "function",
    "name": "reportarIncidencia",
    "inputs": [
      {"name": "_latitude", "type": "string"},
      {"name": "_longitude", "type": "string"}, 
      {"name": "_imageHash", "type": "string"},
      {"name": "_description", "type": "string"},
      {"name": "_category", "type": "string"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  
  // Función para validar reportes
  {
    "type": "function",
    "name": "validarReporte", 
    "inputs": [{"name": "_reportId", "type": "uint256"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  
  // Función para obtener todos los reportes
  {
    "type": "function",
    "name": "getAllReports",
    "inputs": [],
    "outputs": [
      {
        "components": [
          {"name": "id", "type": "uint256"},
          {"name": "creator", "type": "address"},
          {"name": "latitude", "type": "string"},
          {"name": "longitude", "type": "string"},
          {"name": "imageHash", "type": "string"},
          {"name": "description", "type": "string"},
          {"name": "timestamp", "type": "uint256"},
          {"name": "status", "type": "string"},
          {"name": "confirmations", "type": "address[]"},
          {"name": "category", "type": "string"}
        ],
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view"
  },
  
  // Función para obtener un reporte específico
  {
    "type": "function",
    "name": "getReport",
    "inputs": [{"name": "_reportId", "type": "uint256"}],
    "outputs": [
      {
        "components": [
          {"name": "id", "type": "uint256"},
          {"name": "creator", "type": "address"},
          {"name": "latitude", "type": "string"},
          {"name": "longitude", "type": "string"},
          {"name": "imageHash", "type": "string"},
          {"name": "description", "type": "string"},
          {"name": "timestamp", "type": "uint256"},
          {"name": "status", "type": "string"},
          {"name": "confirmations", "type": "address[]"},
          {"name": "category", "type": "string"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view"
  },
  
  // Función para obtener el total de reportes
  {
    "type": "function",
    "name": "getTotalReports",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  },
  
  // Eventos
  {
    "type": "event",
    "name": "ReporteCreado",
    "inputs": [
      {"indexed": true, "name": "id", "type": "uint256"},
      {"indexed": true, "name": "creator", "type": "address"},
      {"indexed": false, "name": "imageHash", "type": "string"},
      {"indexed": false, "name": "category", "type": "string"},
      {"indexed": false, "name": "timestamp", "type": "uint256"}
    ]
  },
  
  {
    "type": "event", 
    "name": "ReporteValidado",
    "inputs": [
      {"indexed": true, "name": "id", "type": "uint256"},
      {"indexed": true, "name": "validator", "type": "address"},
      {"indexed": false, "name": "newStatus", "type": "string"},
      {"indexed": false, "name": "confirmaciones", "type": "uint256"}
    ]
  }
] as const;
