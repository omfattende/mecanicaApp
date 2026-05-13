# Configurar Contraseña de PostgreSQL

## Método 1: Usando pgAdmin

1. Abre **pgAdmin**
2. Conéctate a tu servidor PostgreSQL
3. Click derecho en **postgres** (usuario) → **Properties**
4. Ve a la pestaña **Definition**
5. Ingresa una contraseña (por ejemplo: `postgres123`)
6. Click en **Save**

## Método 2: Usando psql (línea de comandos)

1. Abre **cmd** o **PowerShell** como administrador
2. Ejecuta:
```bash
psql -U postgres
```

3. Si te pide contraseña y no tienes, presiona Enter
4. Dentro de psql, ejecuta:
```sql
ALTER USER postgres WITH PASSWORD 'postgres123';
```

5. Sal de psql:
```sql
\q
```

## Método 3: Sin contraseña (solo para desarrollo local)

Si prefieres no usar contraseña en desarrollo local:

1. Busca el archivo `pg_hba.conf`:
   - Windows: `C:\Program Files\PostgreSQL\[version]\data\pg_hba.conf`
   
2. Abre el archivo como administrador

3. Busca las líneas que dicen `md5` y cámbialas por `trust`:
```
# IPv4 local connections:
host    all             all             127.0.0.1/32            trust
# IPv6 local connections:
host    all             all             ::1/128                 trust
```

4. Guarda el archivo

5. Reinicia PostgreSQL:
   - Abre **Servicios** (services.msc)
   - Busca **postgresql-x64-[version]**
   - Click derecho → **Reiniciar**

## Después de configurar:

Actualiza el archivo `.env` con tu contraseña:
```env
DB_PASSWORD=postgres123
```

O déjalo vacío si usaste el método 3:
```env
DB_PASSWORD=
```
