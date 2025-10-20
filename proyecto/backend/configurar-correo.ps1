# Script para Configurar Correo SMTP de forma interactiva
# Sistema de Gestión Documental TESCHI

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  📧 CONFIGURACIÓN DE CORREO SMTP - TESCHI" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Host "Este script te ayudará a configurar el correo electrónico" -ForegroundColor Cyan
Write-Host "para el envío automático de credenciales." -ForegroundColor Cyan
Write-Host ""

# Preguntar tipo de configuración
Write-Host "¿Qué tipo de correo usarás?" -ForegroundColor Yellow
Write-Host "1. Gmail (personal o institucional)" -ForegroundColor White
Write-Host "2. Otro servidor SMTP" -ForegroundColor White
Write-Host "3. Usar configuración de prueba (MailTrap - Recomendado para desarrollo)" -ForegroundColor White
Write-Host ""
$opcion = Read-Host "Selecciona una opción (1, 2 o 3)"

Write-Host ""

if ($opcion -eq "1") {
    # Gmail
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  CONFIGURACIÓN DE GMAIL" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "IMPORTANTE:" -ForegroundColor Red
    Write-Host "Para Gmail, necesitas una 'Contraseña de aplicación'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pasos para obtenerla:" -ForegroundColor White
    Write-Host "1. Ve a: https://myaccount.google.com" -ForegroundColor Gray
    Write-Host "2. Habilita 'Verificación en 2 pasos'" -ForegroundColor Gray
    Write-Host "3. Ve a 'Contraseñas de aplicaciones'" -ForegroundColor Gray
    Write-Host "4. Genera una para 'Sistema TESCHI'" -ForegroundColor Gray
    Write-Host "5. Copia la contraseña (16 caracteres)" -ForegroundColor Gray
    Write-Host ""
    
    $continuar = Read-Host "¿Ya tienes tu contraseña de aplicación? (s/n)"
    
    if ($continuar -eq "s" -or $continuar -eq "S") {
        Write-Host ""
        $email = Read-Host "Ingresa tu correo de Gmail"
        $password = Read-Host "Ingresa tu contraseña de aplicación" -AsSecureString
        $password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
        
        $SMTP_HOST = "smtp.gmail.com"
        $SMTP_PORT = "587"
        $SMTP_USER = $email
        $SMTP_PASSWORD = $password
    } else {
        Write-Host ""
        Write-Host "Por favor, sigue los pasos anteriores y vuelve a ejecutar este script." -ForegroundColor Yellow
        exit
    }
    
} elseif ($opcion -eq "2") {
    # Servidor SMTP personalizado
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  CONFIGURACIÓN DE SERVIDOR SMTP PERSONALIZADO" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    
    $SMTP_HOST = Read-Host "Servidor SMTP (ej: mail.teschi.edu.mx)"
    $SMTP_PORT = Read-Host "Puerto SMTP (ej: 587)"
    $SMTP_USER = Read-Host "Usuario/Correo"
    $password = Read-Host "Contraseña" -AsSecureString
    $SMTP_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
    
} elseif ($opcion -eq "3") {
    # MailTrap (para desarrollo)
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  CONFIGURACIÓN DE MAILTRAP (DESARROLLO)" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "MailTrap es un servicio de correo para desarrollo." -ForegroundColor Yellow
    Write-Host "Los correos NO se envían realmente, pero puedes verlos en su web." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pasos:" -ForegroundColor White
    Write-Host "1. Ve a: https://mailtrap.io" -ForegroundColor Gray
    Write-Host "2. Crea una cuenta gratis" -ForegroundColor Gray
    Write-Host "3. Copia las credenciales de tu inbox" -ForegroundColor Gray
    Write-Host ""
    
    $continuar = Read-Host "¿Ya tienes cuenta en MailTrap? (s/n)"
    
    if ($continuar -eq "s" -or $continuar -eq "S") {
        Write-Host ""
        $username = Read-Host "Username de MailTrap"
        $password = Read-Host "Password de MailTrap" -AsSecureString
        $password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
        
        $SMTP_HOST = "sandbox.smtp.mailtrap.io"
        $SMTP_PORT = "2525"
        $SMTP_USER = $username
        $SMTP_PASSWORD = $password
    } else {
        Write-Host ""
        Write-Host "Por favor, crea tu cuenta en MailTrap y vuelve a ejecutar este script." -ForegroundColor Yellow
        exit
    }
} else {
    Write-Host "Opción no válida" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ACTUALIZANDO ARCHIVO .ENV" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# Leer el archivo .env actual
$envContent = Get-Content .env

# Actualizar las variables SMTP
$envContent = $envContent -replace "SMTP_HOST=.*", "SMTP_HOST=$SMTP_HOST"
$envContent = $envContent -replace "SMTP_PORT=.*", "SMTP_PORT=$SMTP_PORT"
$envContent = $envContent -replace "SMTP_USER=.*", "SMTP_USER=$SMTP_USER"
$envContent = $envContent -replace "SMTP_PASSWORD=.*", "SMTP_PASSWORD=$SMTP_PASSWORD"

# Asegurar que FRONTEND_URL esté configurado
if ($envContent -notmatch "FRONTEND_URL=") {
    $envContent += "`nFRONTEND_URL=http://localhost:3000"
}

# Guardar el archivo .env actualizado
$envContent | Set-Content .env

Write-Host "✅ Archivo .env actualizado correctamente" -ForegroundColor Green
Write-Host ""

Write-Host "Configuración aplicada:" -ForegroundColor Cyan
Write-Host "  SMTP_HOST: $SMTP_HOST" -ForegroundColor White
Write-Host "  SMTP_PORT: $SMTP_PORT" -ForegroundColor White
Write-Host "  SMTP_USER: $SMTP_USER" -ForegroundColor White
Write-Host "  SMTP_PASSWORD: ********" -ForegroundColor White
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ CONFIGURACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Host "PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "1. Reinicia el backend (Ctrl+C y luego: npm start)" -ForegroundColor White
Write-Host "2. Verifica en los logs: '✅ Conexión al servidor SMTP verificada'" -ForegroundColor White
Write-Host "3. Crea un usuario de prueba" -ForegroundColor White
Write-Host "4. Revisa tu correo (o MailTrap si usaste esa opción)" -ForegroundColor White
Write-Host ""

Write-Host "¿Quieres reiniciar el backend ahora? (s/n): " -ForegroundColor Cyan -NoNewline
$reiniciar = Read-Host

if ($reiniciar -eq "s" -or $reiniciar -eq "S") {
    Write-Host ""
    Write-Host "Iniciando backend..." -ForegroundColor Green
    npm start
}

