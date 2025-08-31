import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Módulo de despliegue para el contrato Vigia
 * Usando Hardhat Ignition - el sistema moderno de despliegue
 */
const VigiaModule = buildModule("VigiaModule", (m) => {
  // Desplegamos el contrato Vigia
  const vigia = m.contract("Vigia", []);

  // Exportamos el contrato para uso posterior
  return { vigia };
});

export default VigiaModule;
