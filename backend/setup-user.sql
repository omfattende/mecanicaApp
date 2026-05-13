-- Ejecuta este script en pgAdmin como usuario postgres

-- Opción 1: Dar permisos al usuario admin123
ALTER ROLE admin123 WITH LOGIN;
ALTER ROLE admin123 WITH CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE postgres TO admin123;

-- Opción 2: O mejor, usar el usuario postgres
-- Establece una contraseña simple para postgres
ALTER USER postgres WITH PASSWORD 'admin123';

-- Crear la base de datos mecanica si no existe
CREATE DATABASE mecanica;

-- Dar permisos al usuario admin123 en la base de datos mecanica
GRANT ALL PRIVILEGES ON DATABASE mecanica TO admin123;

SELECT 'Configuración completada' AS resultado;
