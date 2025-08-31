# 📸 Configuración de IPFS para Vigia

## 🚀 Configuración Rápida

### 1. Registro en Web3.Storage
1. Ve a [web3.storage](https://web3.storage)
2. Regístrate con tu email
3. Confirma tu email

### 2. Configurar tu Email
Edita el archivo `lib/ipfs-config.ts` y cambia:
```typescript
DEFAULT_EMAIL: 'tu-email-real@gmail.com' as `${string}@${string}`,
```

### 3. Primera Autorización
1. Ejecuta la aplicación con `npm run dev`
2. Abre el modal de reporte
3. **IMPORTANTE**: Revisa tu email para autorizar la aplicación
4. Haz clic en el enlace de autorización
5. ¡Ya puedes subir imágenes a IPFS!

## 🔧 Cómo Funciona

1. **Subida automática**: Al seleccionar una imagen, se sube automáticamente a IPFS
2. **CID único**: Cada imagen recibe un identificador único (CID)
3. **Almacenamiento descentralizado**: Las imágenes se almacenan en la red IPFS
4. **Integración blockchain**: El CID se guarda en el smart contract

## 📝 Estados de la Subida

- 🔄 **Inicializando**: Preparando cliente de almacenamiento
- ⬆️ **Subiendo**: Enviando imagen a IPFS
- ✅ **Completado**: Imagen lista para reportar
- ❌ **Error**: Problema en la subida

## 🌐 Ver Imágenes

Las imágenes se pueden ver en:
```
https://[CID].ipfs.storacha.link
```

## 🛠️ Solución de Problemas

### "Cliente no está listo"
- Verifica tu conexión a internet
- Revisa que tu email esté autorizado

### "Error subiendo a IPFS"
- Verifica el tamaño del archivo (máximo 5MB)
- Solo se permiten imágenes (JPEG, PNG, WebP, GIF)

### "Error de autorización"
- Revisa tu email
- Haz clic en el enlace de autorización
- Refresca la aplicación

## 📊 Límites

- **Tamaño máximo**: 5MB por imagen
- **Tipos permitidos**: JPEG, PNG, WebP, GIF
- **Red**: IPFS descentralizada
- **Costo**: Gratis en Storacha

## 🔍 Debugging

Abre las DevTools del navegador para ver:
- Estado del cliente IPFS
- CID de imágenes subidas
- URLs de acceso directo
- Errores detallados
