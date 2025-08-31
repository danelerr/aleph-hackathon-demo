async function main() {
  console.log("🚀 Script de ayuda para despliegue del contrato Vigia");

  console.log("📄 Para desplegar el contrato, usa Hardhat Ignition:");
  console.log("");
  console.log("Comandos disponibles:");
  console.log("- Local: npx hardhat ignition deploy ignition/modules/Vigia.ts --network localhost");
  console.log("- Lisk Sepolia: npx hardhat ignition deploy ignition/modules/Vigia.ts --network liskSepolia");
  console.log("");
  console.log("🌐 Redes configuradas:");
  console.log("- localhost: http://127.0.0.1:8545 (Chain ID: 31337)");
  console.log("- liskSepolia: https://rpc.sepolia-api.lisk.com (Chain ID: 4202)");
  console.log("");
  console.log("📋 Después del despliegue, actualiza la dirección en:");
  console.log("- lib/contracts/vigia-config.ts");
  console.log("");
  console.log("💡 Para compilar solo: npx hardhat compile");
}

// Manejo de errores
main()
  .then(() => {
    console.log("\n✅ Información mostrada correctamente!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error:");
    console.error(error);
    process.exit(1);
  });
