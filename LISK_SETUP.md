# Vigia - Smart Contract en Lisk L2

## 🚀 Configuración completada

### ✅ Lo que tienes configurado:

1. **Smart Contract Vigia** (`contracts/Vigia.sol`) - ✅ Compilado exitosamente
2. **Hardhat moderno** con Viem y herramientas avanzadas  
3. **Red Lisk Sepolia** configurada para testing
4. **Sistema de despliegue** con Hardhat Ignition

### 📋 Próximos pasos para desplegar:

#### 1. Configurar variables de entorno
```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env y agrega tu clave privada
# LISK_PRIVATE_KEY=0x...
```

#### 2. Obtener ETH para testnet
- Ve a: https://sepolia-faucet.lisk.com/
- Conecta tu wallet y obtén ETH gratis

#### 3. Desplegar el contrato
```bash
# Desplegar en Lisk Sepolia testnet
npx hardhat ignition deploy ignition/modules/Vigia.ts --network liskSepolia

# Ver contratos desplegados
npx hardhat ignition status --network liskSepolia
```

### 🌐 URLs importantes:
- **RPC Lisk Sepolia**: https://rpc.sepolia-api.lisk.com
- **Explorer**: https://sepolia-blockscout.lisk.com
- **Faucet**: https://sepolia-faucet.lisk.com/
- **Chain ID**: 4202

### 📱 Para el frontend:
Cuando despliegues el contrato, obtendrás la dirección del contrato que necesitarás para conectar tu frontend con ethers.js o viem.

### 🔧 Comandos útiles:
```bash
# Compilar contratos
npx hardhat compile

# Ejecutar tests (cuando los crees)
npx hardhat test

# Verificar contrato desplegado
npx hardhat verify --network liskSepolia DEPLOYED_CONTRACT_ADDRESS
```
