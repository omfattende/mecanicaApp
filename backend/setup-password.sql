-- Ejecuta este script en pgAdmin para establecer la contraseña

-- Establecer contraseña para el usuario postgres
ALTER USER postgres WITH PASSWORD 'postgres';

-- Verificar que funcionó
SELECT 'Contraseña establecida correctamente' AS resultado;
