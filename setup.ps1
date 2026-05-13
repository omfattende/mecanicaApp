# TallerPro - Script de Setup para Windows
# ========================================

Write-Host "🚀 TallerPro - Script de Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Función para verificar dependencias
function Test-Command {
    param($Command)
    $exists = $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
    return $exists
}

Write-Host ""
Write-Host "📋 Verificando dependencias..." -ForegroundColor Yellow

$deps = @(
    @{Name="node"; Display="Node.js"},
    @{Name="npm"; Display="npm"},
    @{Name="docker"; Display="Docker"; Optional=$true},
    @{Name="docker-compose"; Display="Docker Compose"; Optional=$true}
)

foreach ($dep in $deps) {
    if (Test-Command $dep.Name) {
        Write-Host "✅ $($dep.Display) instalado" -ForegroundColor Green
    } else {
        if ($dep.Optional) {
            Write-Host "⚠️  $($dep.Display) no instalado (opcional)" -ForegroundColor Yellow
        } else {
            Write-Host "❌ $($dep.Display) no instalado - REQUERIDO" -ForegroundColor Red
            exit 1
        }
    }
}

Write-Host ""
Write-Host "📦 Versiones:" -ForegroundColor Yellow
node --version
npm --version

# Setup Backend
Write-Host ""
Write-Host "🔧 Configurando Backend..." -ForegroundColor Yellow
Set-Location backend

Write-Host "Instalando dependencias del backend..." -ForegroundColor Cyan
npm install

Write-Host "Generando cliente Prisma..." -ForegroundColor Cyan
npx prisma generate

if (-not (Test-Path .env)) {
    Write-Host "⚠️ Archivo .env no encontrado, copiando desde .env.example" -ForegroundColor Yellow
    Copy-Item .env.example .env
}

Set-Location ..

# Setup Frontend
Write-Host ""
Write-Host "🎨 Configurando Frontend..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "✅ Setup completado!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Asegúrate de tener PostgreSQL corriendo"
Write-Host "   - Con Docker: docker-compose up -d postgres"
Write-Host "   - Local: Configura DB_HOST en backend/.env"
Write-Host ""
Write-Host "2. Corre las migraciones de la base de datos:"
Write-Host "   cd backend; npx prisma migrate dev"
Write-Host ""
Write-Host "3. (Opcional) Carga datos de prueba:"
Write-Host "   cd backend; npx prisma db seed"
Write-Host ""
Write-Host "4. Inicia el backend:"
Write-Host "   cd backend; npm run dev"
Write-Host ""
Write-Host "5. En otra terminal, inicia el frontend:"
Write-Host "   npm start"
Write-Host ""
Write-Host "O usa Docker para todo:"
Write-Host "   docker-compose up -d"
Write-Host ""
