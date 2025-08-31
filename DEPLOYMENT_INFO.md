# 🚀 Configuración de Despliegue - Vigia

## 📋 Información de Configuración

### 🔑 Wallet Testnet (Lisk Sepolia)
- **Private Key**: `0xdf438ee6123ee2fce7687a054d29ab38632654eb7583f40adbbcaaba8e4959b8`
- **Network**: Lisk Sepolia Testnet
- **Chain ID**: 4202
- **RPC URL**: https://rpc.sepolia-api.lisk.com

### 🌐 Web3.Storage / Storacha
- **Email**: danielcuetorrico@gmail.com
- **Space Name**: vigia
- **DID**: `did:key:z6MkvSabbvP29rQhoxpU4aJqJfrErFBeepfqohRYMVzn4nzN`

### 📝 Contratos Desplegados

#### Hardhat Local
- **Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Network**: Hardhat Local (Chain ID: 31337)

#### Lisk Sepolia Testnet
- **Address**: `0x9aD20ACF1E3592efF473B510603f5f647994cE9b`
- **Network**: Lisk Sepolia (Chain ID: 4202)
- **Explorer**: https://sepolia-blockscout.lisk.com/address/0x9aD20ACF1E3592efF473B510603f5f647994cE9b

## 🛠️ Comandos de Despliegue

### Hardhat Local
```bash
# Iniciar nodo local
npx hardhat node

# Desplegar en red local
npx hardhat ignition deploy ignition/modules/Vigia.ts --network localhost
```

### Lisk Sepolia Testnet
```bash
# Desplegar en testnet
npx hardhat ignition deploy ignition/modules/Vigia.ts --network liskSepolia
```

## 🔧 Variables de Entorno

Archivo `.env`:
```env
# Configuración de red blockchain
PRIVATE_KEY=0xdf438ee6123ee2fce7687a054d29ab38632654eb7583f40adbbcaaba8e4959b8

# Web3.Storage / Storacha Configuration
WEB3_STORAGE_EMAIL=danielcuetorrico@gmail.com
WEB3_STORAGE_SPACE=vigia
WEB3_STORAGE_DID=did:key:z6MkvSabbvP29rQhoxpU4aJqJfrErFBeepfqohRYMVzn4nzN

# Network URLs
LISK_SEPOLIA_RPC_URL=https://rpc.sepolia-api.lisk.com
HARDHAT_RPC_URL=http://127.0.0.1:8545

# Deployed Contract Addresses
VIGIA_CONTRACT_ADDRESS_HARDHAT=0x5FbDB2315678afecb367f032d93F642f64180aa3
VIGIA_CONTRACT_ADDRESS_LISK_SEPOLIA=0x9aD20ACF1E3592efF473B510603f5f647994cE9b
```

## 🎯 Funcionalidades Implementadas

### ✅ Smart Contract (Vigia.sol)
- ✅ Crear reportes de incidencias
- ✅ Validar reportes (3 confirmaciones para verificar)
- ✅ Almacenar imágenes IPFS (CID)
- ✅ Categorías de incidencias
- ✅ Geolocalización (lat/lng)
- ✅ Eventos para tracking

### ✅ Frontend (Next.js + TypeScript)
- ✅ Conexión con MetaMask
- ✅ Interfaz de usuario responsive
- ✅ Mapa interactivo (Leaflet)
- ✅ Subida automática a IPFS
- ✅ Botón flotante de geolocalización
- ✅ Modal de reportes con validaciones
- ✅ Modo oscuro/claro
- ✅ Notificaciones con Sonner

### ✅ IPFS Integration
- ✅ Storacha/Web3.Storage client
- ✅ Subida automática de imágenes
- ✅ Validación de archivos (5MB max)
- ✅ URLs públicas de acceso
- ✅ CID almacenado en blockchain

## 🌍 Redes Soportadas

1. **Hardhat Local** (Desarrollo)
   - Chain ID: 31337
   - RPC: http://127.0.0.1:8545

2. **Lisk Sepolia** (Testnet)
   - Chain ID: 4202
   - RPC: https://rpc.sepolia-api.lisk.com
   - Explorer: https://sepolia-blockscout.lisk.com

## 🚀 Cómo Usar

1. **Conectar Wallet**: MetaMask en Lisk Sepolia
2. **Obtener Ubicación**: Botón flotante de geolocalización
3. **Subir Imagen**: Automático al seleccionar archivo
4. **Crear Reporte**: Llenar formulario y enviar
5. **Ver en Blockchain**: Usar el explorer de Lisk

## 🔍 Verificación

- **Contrato**: https://sepolia-blockscout.lisk.com/address/0x9aD20ACF1E3592efF473B510603f5f647994cE9b
- **Imágenes IPFS**: https://[CID].ipfs.storacha.link
- **App Local**: http://localhost:3000

## 🎉 Estado del Proyecto

**🟢 COMPLETAMENTE FUNCIONAL**
- ✅ Smart contract desplegado
- ✅ Frontend implementado
- ✅ IPFS integrado
- ✅ Wallet conectado
- ✅ Listo para demo
