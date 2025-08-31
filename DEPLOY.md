# 🚀 Vigia - Despliegue de Smart Contract

## Comandos de Despliegue

### 📋 Preparación
```bash
# Compilar el contrato
npm run compile
```

### 🏠 Red Local (Testing)
```bash
# 1. Iniciar red local Hardhat
npm run node

# 2. En otra terminal, desplegar
npm run deploy:local
```

### 🌐 Lisk Sepolia Testnet
```bash
# Desplegar en testnet
npm run deploy:lisk
```

## 📁 Estructura del Proyecto

- `contracts/Vigia.sol` - Smart contract principal
- `ignition/modules/Vigia.ts` - Módulo de despliegue con Hardhat Ignition
- `lib/contracts/` - Configuración y cliente para el frontend

## 🔧 Configuración Post-Despliegue

Después del despliegue, actualizar la dirección del contrato en:
- `lib/contracts/vigia-config.ts`

## 🌍 Redes Configuradas

- **localhost**: http://127.0.0.1:8545 (Chain ID: 31337)
- **liskSepolia**: https://rpc.sepolia-api.lisk.com (Chain ID: 4202)
