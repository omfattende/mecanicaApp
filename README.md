# TallerPro v2.0 🚗🔧

Sistema de gestión para taller mecánico con arquitectura moderna, segura y escalable.

## ✨ Características

- **🔐 Seguridad mejorada**: JWT en HttpOnly cookies, Rate Limiting, Helmet
- **📊 Base de datos**: PostgreSQL con Prisma ORM
- **⚡ Backend**: Node.js + Express + TypeScript
- **🎨 Frontend**: Angular 19 con Signals
- **🐳 Docker**: Despliegue completo con docker-compose
- **🧪 Testing**: Jest para tests unitarios e integración
- **📝 Logging**: Winston con rotación de archivos
- **✅ Validación**: Zod para validación de schemas

## 🏗️ Arquitectura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Angular   │────▶│   Express   │────▶│  PostgreSQL │
│   (SPA)     │◀────│    API      │◀────│   + Prisma  │
└─────────────┘     └─────────────┘     └─────────────┘
      │                    │
      │              ┌─────────────┐
      └──────────────│  HttpOnly   │
                     │   Cookies   │
                     └─────────────┘
```

## 🚀 Instalación Rápida

### Opción 1: Setup Automático

**Linux/Mac:**
```bash
./setup.sh
```

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

### Opción 2: Docker (Recomendado)

```bash
# Todo el stack
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Opción 3: Manual

**Requisitos:**
- Node.js 18+
- PostgreSQL 14+
- npm o yarn

**Backend:**
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

**Frontend:**
```bash
npm install
npm start
```

## 📁 Estructura del Proyecto

```
mecanica-app/
├── backend/                 # API Node.js + TypeScript
│   ├── src/
│   │   ├── config/         # Configuraciones
│   │   ├── controllers/    # Controladores HTTP
│   │   ├── services/       # Lógica de negocio
│   │   ├── repositories/   # Acceso a datos
│   │   ├── middlewares/    # Middlewares Express
│   │   ├── validators/     # Schemas Zod
│   │   └── routes/         # Definición de rutas
│   ├── prisma/
│   │   ├── schema.prisma   # Schema de BD
│   │   └── seed.ts         # Datos de prueba
│   └── tests/              # Tests Jest
│
├── src/app/
│   └── core/               # Servicios, interceptores, guards
├── environments/           # Configuración por ambiente
├── docker-compose.yml      # Orquestación Docker
└── README.md
```

## 🔌 API Endpoints

### Autenticación
```
POST   /api/auth/login          # Login (setea cookie)
POST   /api/auth/register       # Registro
POST   /api/auth/logout         # Logout (limpia cookie)
GET    /api/auth/me             # Usuario actual
```

### Usuarios
```
GET    /api/usuarios            # Lista usuarios
GET    /api/usuarios/:id        # Detalle usuario
GET    /api/usuarios/profile    # Perfil actual
PUT    /api/usuarios/:id        # Actualizar
DELETE /api/usuarios/:id        # Eliminar
```

### Vehículos
```
GET    /api/vehiculos           # Lista vehículos
GET    /api/vehiculos/:id       # Detalle vehículo
POST   /api/vehiculos           # Crear vehículo
PUT    /api/vehiculos/:id       # Actualizar
DELETE /api/vehiculos/:id       # Eliminar
```

### Citas
```
GET    /api/citas               # Lista citas
GET    /api/citas/:id           # Detalle cita
POST   /api/citas               # Crear cita
PUT    /api/citas/:id           # Actualizar cita
PUT    /api/citas/:id/estado    # Cambiar estado
POST   /api/citas/:id/cancelar  # Cancelar cita
DELETE /api/citas/:id           # Eliminar cita
```

### Tareas
```
GET    /api/tareas              # Lista tareas
GET    /api/tareas/:id          # Detalle tarea
POST   /api/tareas              # Crear tarea
PUT    /api/tareas/:id          # Actualizar
PATCH  /api/tareas/:id/toggle   # Toggle completada
DELETE /api/tareas/:id          # Eliminar
```

## 🔐 Seguridad

- **HttpOnly Cookies**: Tokens JWT almacenados en cookies seguras
- **Helmet**: Headers de seguridad HTTP
- **Rate Limiting**: 100 requests / 15 minutos por IP
- **CORS**: Configuración estricta
- **Zod**: Validación de inputs
- **bcrypt**: Hash de contraseñas

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test
npm run test:coverage

# Frontend tests
npm test
```

## 📝 Logging

Los logs se guardan en `backend/logs/`:
- `combined-YYYY-MM-DD.log`: Todos los logs
- `error-YYYY-MM-DD.log`: Solo errores
- `exceptions-YYYY-MM-DD.log`: Excepciones no manejadas

## 🛠️ Comandos Útiles

```bash
# Backend
npm run dev           # Desarrollo con hot-reload
npm run build         # Compilar TypeScript
npm run db:migrate    # Crear migración
npm run db:seed       # Cargar datos de prueba
npm run db:studio     # Interfaz visual de BD

# Frontend
npm start             # Servidor de desarrollo
npm run build         # Build de producción

# Docker
docker-compose up -d              # Iniciar todo
docker-compose logs -f backend    # Logs del backend
docker-compose exec backend sh    # Shell en contenedor
```

## 👥 Usuarios de Prueba

Después de correr `npx prisma db seed`:

| Usuario   | Contraseña   | Rol      |
|-----------|--------------|----------|
| admin     | admin123     | Admin    |
| cliente1  | cliente123   | Cliente  |
| mecanico1 | mecanico123  | Mecánico |

## 📄 Licencia

MIT

---

Desarrollado con ❤️ para talleres mecánicos.
