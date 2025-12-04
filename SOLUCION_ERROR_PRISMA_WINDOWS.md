# Solución Error Prisma EPERM en Windows

## Problema
Error `EPERM: operation not permitted` al ejecutar `npx prisma generate` o `npx prisma db push`.

Este error ocurre porque el archivo `query_engine-windows.dll.node` está siendo usado por otro proceso o hay problemas de permisos.

## Soluciones (en orden de prioridad)

### Solución 1: Cerrar procesos que usan Prisma

1. **Cerrar el servidor de desarrollo** (si está corriendo):
   - Presiona `Ctrl + C` en la terminal donde está corriendo `npm run dev`
   - Espera a que se cierre completamente

2. **Cerrar Prisma Studio** (si está abierto):
   - Cierra la ventana de Prisma Studio
   - O ejecuta: `taskkill /F /IM node.exe` (esto cerrará todos los procesos Node.js)

3. **Cerrar el IDE/Editor** temporalmente:
   - Cierra Visual Studio Code o tu editor
   - O al menos cierra la carpeta `node_modules/.prisma`

### Solución 2: Eliminar y regenerar el cliente de Prisma

```bash
# 1. Eliminar la carpeta .prisma
cd proyecto/backend
rmdir /s /q node_modules\.prisma

# 2. Regenerar el cliente
npx prisma generate
```

### Solución 3: Ejecutar como Administrador

1. Cierra todas las terminales
2. Abre PowerShell o CMD **como Administrador** (clic derecho → "Ejecutar como administrador")
3. Navega a la carpeta del backend:
   ```bash
   cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\backend
   ```
4. Ejecuta:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Solución 4: Desactivar Antivirus temporalmente

Algunos antivirus bloquean la modificación de archivos `.dll.node`. 

1. Desactiva temporalmente tu antivirus
2. Ejecuta `npx prisma generate`
3. Reactiva el antivirus
4. Agrega una excepción para la carpeta `node_modules\.prisma`

### Solución 5: Usar PowerShell con permisos elevados

```powershell
# En PowerShell como Administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\backend
npx prisma generate
npx prisma db push
```

### Solución 6: Reiniciar la computadora

Si nada funciona, reinicia la computadora y luego:
1. Abre una terminal nueva
2. Ve a la carpeta del backend
3. Ejecuta `npx prisma generate`

## Solución Rápida Recomendada

```bash
# 1. Cerrar todos los procesos Node.js
taskkill /F /IM node.exe

# 2. Esperar 5 segundos

# 3. Eliminar carpeta .prisma
cd proyecto\backend
if exist node_modules\.prisma rmdir /s /q node_modules\.prisma

# 4. Regenerar
npx prisma generate

# 5. Actualizar base de datos
npx prisma db push
```

## Nota sobre el Warning

El warning sobre `package.json#prisma` es solo una advertencia y no afecta el funcionamiento. Puedes ignorarlo por ahora o eliminar la sección `prisma` del `package.json` si quieres.

## Verificar que funcionó

Después de ejecutar los comandos, deberías ver:
```
✔ Generated Prisma Client
```

Sin errores de `EPERM`.

