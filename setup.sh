#!/bin/bash

set -e

echo "🚀 TallerPro - Script de Setup"
echo "================================"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar dependencias
check_dependency() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 no está instalado${NC}"
        return 1
    else
        echo -e "${GREEN}✅ $1 instalado${NC}"
        return 0
    fi
}

echo ""
echo "📋 Verificando dependencias..."
check_dependency node || exit 1
check_dependency npm || exit 1
check_dependency docker || echo -e "${YELLOW}⚠️ Docker no instalado (opcional)${NC}"
check_dependency docker-compose || echo -e "${YELLOW}⚠️ Docker Compose no instalado (opcional)${NC}"

# Verificar versiones
echo ""
echo "📦 Versiones:"
node --version
npm --version

# Setup Backend
echo ""
echo "🔧 Configurando Backend..."
cd backend

# Instalar dependencias
echo "Instalando dependencias del backend..."
npm install

# Generar cliente Prisma
echo "Generando cliente Prisma..."
npx prisma generate

# Verificar si existe .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️ Archivo .env no encontrado, copiando desde .env.example${NC}"
    cp .env.example .env
fi

cd ..

# Setup Frontend
echo ""
echo "🎨 Configurando Frontend..."
npm install

echo ""
echo -e "${GREEN}✅ Setup completado!${NC}"
echo ""
echo "Próximos pasos:"
echo ""
echo "1. Asegúrate de tener PostgreSQL corriendo"
echo "   - Con Docker: docker-compose up -d postgres"
echo "   - Local: Configura DB_HOST en backend/.env"
echo ""
echo "2. Corre las migraciones de la base de datos:"
echo "   cd backend && npx prisma migrate dev"
echo ""
echo "3. (Opcional) Carga datos de prueba:"
echo "   cd backend && npx prisma db seed"
echo ""
echo "4. Inicia el backend:"
echo "   cd backend && npm run dev"
echo ""
echo "5. En otra terminal, inicia el frontend:"
echo "   npm start"
echo ""
echo "O usa Docker para todo:"
echo "   docker-compose up -d"
echo ""
