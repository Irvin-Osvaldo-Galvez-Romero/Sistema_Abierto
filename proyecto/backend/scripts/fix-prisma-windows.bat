@echo off
echo ========================================
echo Solucionando errores de Prisma en Windows
echo ========================================
echo.

echo 1. Cerrando procesos Node.js...
taskkill /F /IM node.exe 2>nul
if %errorlevel% == 0 (
    echo    Procesos Node.js cerrados
    timeout /t 2 /nobreak >nul
) else (
    echo    No hay procesos Node.js corriendo
)
echo.

echo 2. Eliminando carpeta .prisma...
if exist "node_modules\.prisma" (
    rmdir /s /q "node_modules\.prisma"
    echo    Carpeta .prisma eliminada
) else (
    echo    La carpeta .prisma no existe
)
echo.

echo 3. Esperando 3 segundos...
timeout /t 3 /nobreak >nul
echo.

echo 4. Regenerando Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo    ERROR: No se pudo regenerar Prisma Client
    pause
    exit /b 1
)
echo    Prisma Client regenerado correctamente
echo.

echo 5. Actualizando base de datos...
call npx prisma db push
if %errorlevel% neq 0 (
    echo    ERROR: No se pudo actualizar la base de datos
    pause
    exit /b 1
)
echo    Base de datos actualizada correctamente
echo.

echo ========================================
echo Proceso completado exitosamente!
echo ========================================
echo.
echo Ahora puedes iniciar el servidor con: npm run dev
pause

