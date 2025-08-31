require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    // Red de prueba Lisk Sepolia
    liskSepolia: {
      url: "https://rpc.sepolia-api.lisk.com",
      accounts: [], // Aquí irán las claves privadas de desarrollo
      chainId: 4202,
    },
    // Red principal de Lisk (para cuando estés listo para producción)
    lisk: {
      url: "https://rpc.api.lisk.com",
      accounts: [], // Aquí irán las claves privadas de producción
      chainId: 1135,
    },
    // Red local para desarrollo
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    // Para verificar contratos en Lisk
    apiKey: {
      liskSepolia: "your-lisk-api-key", // Opcional: para verificación de contratos
    },
    customChains: [
      {
        network: "liskSepolia",
        chainId: 4202,
        urls: {
          apiURL: "https://sepolia-blockscout.lisk.com/api",
          browserURL: "https://sepolia-blockscout.lisk.com"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};
