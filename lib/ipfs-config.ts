// Configuración para IPFS usando Storacha
export const IPFS_CONFIG = {
  // Email registrado en web3.storage
  DEFAULT_EMAIL: 'danielcuetorrico@gmail.com' as `${string}@${string}`,
  
  // Nombre del espacio
  SPACE_NAME: 'vigia',
  
  // DID del espacio (actualizado)
  SPACE_DID: 'did:key:z6Mkjn9cvz3d8gxbB5uPGYCjwjE7mxKu7xgh1JQjrGbEsPU8' as `did:${string}:${string}`,
  
  // URL base para ver archivos en IPFS
  GATEWAY_URL: 'https://%CID%.ipfs.w3s.link',
  
  // Tipos de archivo permitidos
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  
  // Tamaño máximo de archivo (5MB)
  MAX_FILE_SIZE: 5 * 1024 * 1024,
}

export const getIPFSUrl = (cid: string): string => {
  return IPFS_CONFIG.GATEWAY_URL.replace('%CID%', cid)
}

export const isValidImageFile = (file: File): boolean => {
  return IPFS_CONFIG.ALLOWED_TYPES.includes(file.type) && 
         file.size <= IPFS_CONFIG.MAX_FILE_SIZE
}
