const hre = require("hardhat");

async function main() {
  console.log("🚀 Desplegando el contrato Vigia en Lisk...");

  // Obtenemos el factory del contrato
  const VigiaFactory = await hre.ethers.getContractFactory("Vigia");
  
  // Desplegamos el contrato
  console.log("📄 Compilando y desplegando contrato...");
  const vigia = await VigiaFactory.deploy();
  
  // Esperamos a que se confirme el despliegue
  await vigia.waitForDeployment();
  
  const contractAddress = await vigia.getAddress();
  
  console.log("✅ ¡Contrato Vigia desplegado exitosamente!");
  console.log(`📍 Dirección del contrato: ${contractAddress}`);
  console.log(`🔗 Ver en Lisk Explorer: https://sepolia-blockscout.lisk.com/address/${contractAddress}`);
  
  // Obtener información de la red
  const network = await hre.ethers.provider.getNetwork();
  console.log(`🌐 Red: ${network.name} (Chain ID: ${network.chainId})`);
  
  // Obtener información del deployer
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log(`👤 Deployer: ${deployer.address}`);
  console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} ETH`);
  
  console.log("\n📋 Información para el frontend:");
  console.log(`Contract Address: "${contractAddress}"`);
  console.log(`Chain ID: ${network.chainId}`);
  
  // Verificar que el contrato funciona
  console.log("\n🧪 Probando funcionalidad básica...");
  try {
    const totalReports = await vigia.getTotalReports();
    console.log(`📊 Total de reportes inicial: ${totalReports}`);
    console.log("✅ El contrato está funcionando correctamente!");
  } catch (error) {
    console.error("❌ Error al probar el contrato:", error);
  }
}

// Manejo de errores
main()
  .then(() => {
    console.log("\n🎉 Despliegue completado exitosamente!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error durante el despliegue:");
    console.error(error);
    process.exit(1);
  });
