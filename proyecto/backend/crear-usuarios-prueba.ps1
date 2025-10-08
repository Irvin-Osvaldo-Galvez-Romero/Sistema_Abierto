# Script para crear usuarios de prueba
# Sistema Universitario

Write-Host "`n🎓 CREANDO USUARIOS DE PRUEBA`n" -ForegroundColor Green

# Función para crear usuario
function Create-User {
    param($email, $password, $nombre, $apellido, $rol)
    
    Write-Host "📝 Creando: $email ($rol)..." -ForegroundColor Cyan
    
    $body = @{
        email = $email
        password = $password
        nombre = $nombre
        apellidoPaterno = $apellido
        rol = $rol
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest `
            -Uri "http://localhost:3001/api/auth/register" `
            -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body $body `
            -UseBasicParsing
        
        Write-Host "   ✅ Usuario creado exitosamente`n" -ForegroundColor Green
    }
    catch {
        Write-Host "   ⚠️  Error: El usuario probablemente ya existe`n" -ForegroundColor Yellow
    }
}

# Crear usuarios
Write-Host "================================================" -ForegroundColor Yellow
Write-Host "CREANDO USUARIOS DE PRUEBA" -ForegroundColor Yellow
Write-Host "================================================`n" -ForegroundColor Yellow

# Estudiantes
Create-User "estudiante1@universidad.edu.mx" "Password123" "Juan" "Pérez" "ESTUDIANTE"
Create-User "estudiante2@universidad.edu.mx" "Password123" "Pedro" "López" "ESTUDIANTE"
Create-User "estudiante3@universidad.edu.mx" "Password123" "Ana" "Martínez" "ESTUDIANTE"
Create-User "estudiante4@universidad.edu.mx" "Password123" "Luis" "García" "ESTUDIANTE"
Create-User "estudiante5@universidad.edu.mx" "Password123" "Laura" "Rodríguez" "ESTUDIANTE"

# Administradores
Create-User "admin@universidad.edu.mx" "Admin123!" "María" "González" "ADMINISTRADOR"
Create-User "admin2@universidad.edu.mx" "Admin123!" "Roberto" "Sánchez" "ADMINISTRADOR"

# Profesores
Create-User "profesor1@universidad.edu.mx" "Profesor123!" "Carlos" "Ramírez" "PROFESOR"
Create-User "profesor2@universidad.edu.mx" "Profesor123!" "Elena" "Torres" "PROFESOR"

# Personal Administrativo
Create-User "personal@universidad.edu.mx" "Personal123!" "Jorge" "Hernández" "PERSONAL_ADMINISTRATIVO"

# Super Admin
Create-User "superadmin@universidad.edu.mx" "SuperAdmin123!" "Diana" "Flores" "SUPER_ADMIN"

Write-Host "`n================================================" -ForegroundColor Yellow
Write-Host "✅ PROCESO COMPLETADO" -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Yellow

Write-Host "📋 CREDENCIALES CREADAS:`n" -ForegroundColor Cyan

Write-Host "ESTUDIANTES:" -ForegroundColor White
Write-Host "  estudiante1@universidad.edu.mx / Password123" -ForegroundColor Gray
Write-Host "  estudiante2@universidad.edu.mx / Password123" -ForegroundColor Gray
Write-Host "  estudiante3@universidad.edu.mx / Password123" -ForegroundColor Gray
Write-Host "  estudiante4@universidad.edu.mx / Password123" -ForegroundColor Gray
Write-Host "  estudiante5@universidad.edu.mx / Password123`n" -ForegroundColor Gray

Write-Host "ADMINISTRADORES:" -ForegroundColor White
Write-Host "  admin@universidad.edu.mx / Admin123!" -ForegroundColor Gray
Write-Host "  admin2@universidad.edu.mx / Admin123!`n" -ForegroundColor Gray

Write-Host "PROFESORES:" -ForegroundColor White
Write-Host "  profesor1@universidad.edu.mx / Profesor123!" -ForegroundColor Gray
Write-Host "  profesor2@universidad.edu.mx / Profesor123!`n" -ForegroundColor Gray

Write-Host "PERSONAL:" -ForegroundColor White
Write-Host "  personal@universidad.edu.mx / Personal123!`n" -ForegroundColor Gray

Write-Host "SUPER ADMIN:" -ForegroundColor White
Write-Host "  superadmin@universidad.edu.mx / SuperAdmin123!`n" -ForegroundColor Gray

Write-Host "`n🌐 Accede al sistema en: http://localhost:3000`n" -ForegroundColor Cyan


