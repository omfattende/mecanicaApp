# Solución Rápida - Configurar PostgreSQL

## Paso 1: Establecer contraseña para postgres

Abre **cmd** o **PowerShell** y ejecuta:

```bash
psql -U postgres
```

Si te pide contraseña y no funciona, intenta:

```bash
psql -U postgres -h localhost
```

## Paso 2: Una vez dentro de psql, ejecuta:

```sql
ALTER USER postgres WITH PASSWORD 'postgres';
```

Luego sal:
```sql
\q
```

## Paso 3: Actualiza el archivo .env

Cambia la línea de DB_PASSWORD a:
```
DB_PASSWORD=postgres
```

## Paso 4: Prueba la conexión

```bash
node test-connection.js
```

## Si psql no funciona:

### Opción A: Usar pgAdmin
1. Abre pgAdmin
2. Conecta al servidor (puede que no pida contraseña la primera vez)
3. Click derecho en "postgres" (bajo Login/Group Roles)
4. Properties → Definition
5. Establece password: `postgres`
6. Save

### Opción B: Reinstalar PostgreSQL
Si nada funciona, reinstala PostgreSQL y durante la instalación:
- Establece la contraseña como: `postgres`
- Anota el puerto (por defecto 5432)

## Después de configurar:

1. Actualiza `.env` con la contraseña correcta
2. Ejecuta: `node test-connection.js`
3. Si funciona, ejecuta: `npm run init-db`
4. Inicia el servidor: `npm run dev`
