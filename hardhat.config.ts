import type { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-verify";
import { configVariable } from "hardhat/config";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.20", // Versión actual del contrato desplegado
      },
      latest: {
        version: "0.8.30", // Versión más reciente para desarrollo futuro
      },
      production: {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    // Red local para desarrollo
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    // Lisk Sepolia Testnet (L2)
    liskSepolia: {
      type: "http",
      chainType: "op", // op es para Layer 2 chains
      url: "https://rpc.sepolia-api.lisk.com",
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 4202,
    },
    // Lisk Sepolia Testnet (configuración alternativa)
    'lisk-sepolia-testnet': {
      type: "http",
      url: 'https://rpc.sepolia-api.lisk.com',
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 4202,
    },
  },
};

export default config;
