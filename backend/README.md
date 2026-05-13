# Backend TallerPro - Instrucciones de Configuración

## 📋 Requisitos Previos

- Node.js instalado (v16 o superior)
- PostgreSQL instalado y corriendo
- Base de datos "mecanica" creada

## 🔧 Configuración de PostgreSQL

### 1. Crear la base de datos

Abre pgAdmin o psql y ejecuta:

```sql
CREATE DATABASE mecanica;
```

### 2. Configurar contraseña de postgres (si es necesario)

Si no tienes contraseña configurada para el usuario postgres:

```sql
ALTER USER postgres WITH PASSWORD 'tu_contraseña';
```

### 3. Actualizar el archivo .env

Edita el archivo `backend/.env` y agrega tu contraseña:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui
DB_NAME=mecanica
JWT_SECRET=tallerpro_secret_key_2024
```

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Inicializar la base de datos

Este comando creará todas las tablas necesarias y el usuario admin:

```bash
npm run init-db
```

### 3. Iniciar el servidor

```bash
npm run dev
```

El servidor estará corriendo en: `http://localhost:3000`

## 📊 Estructura de la Base de Datos

### Tablas creadas:

- **usuarios**: Almacena información de usuarios (admin y clientes)
- **vehiculos**: Información de vehículos de los clientes
- **citas**: Citas programadas
- **servicios**: Servicios realizados
- **facturas**: Facturas generadas

### Usuario Admin por defecto:

- **Usuario**: admin
- **Contraseña**: admin

## 🔌 Endpoints de la API

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token

### Usuarios

- `GET /api/users` - Obtener todos los usuarios (solo admin)
- `GET /api/users/:id` - Obtener un usuario específico

## 🧪 Probar la API

Puedes probar los endpoints con:

### Registro:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test",
    "email": "test@test.com",
    "password": "123456",
    "nombre": "Usuario Test",
    "telefono": "1234567890"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin"
  }'
```

## ⚠️ Solución de Problemas

### Error: "password authentication failed"
- Verifica que la contraseña en `.env` sea correcta
- Asegúrate de que PostgreSQL esté corriendo

### Error: "database mecanica does not exist"
- Crea la base de datos con: `CREATE DATABASE mecanica;`

### Error: "ECONNREFUSED"
- Verifica que PostgreSQL esté corriendo en el puerto 5432
- Verifica que el host sea correcto (localhost)

## 📝 Notas

- Las contraseñas se almacenan hasheadas con bcrypt
- Los tokens JWT expiran en 24 horas
- El servidor usa CORS para permitir peticiones desde Angular
