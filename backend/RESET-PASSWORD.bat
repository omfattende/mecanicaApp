@echo off
echo ========================================
echo Reset Password PostgreSQL
echo ========================================
echo.
echo Este script te ayudara a establecer la contrasena de PostgreSQL
echo.
echo Opcion 1: Intenta conectarte con psql
echo.
psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
echo.
if %ERRORLEVEL% EQU 0 (
    echo ✅ Contrasena cambiada exitosamente a: postgres
    echo.
    echo Ahora actualiza el archivo .env con:
    echo DB_PASSWORD=postgres
) else (
    echo ❌ No se pudo cambiar la contrasena
    echo.
    echo Intenta manualmente:
    echo 1. Abre pgAdmin
    echo 2. Conecta al servidor
    echo 3. Click derecho en postgres ^(usuario^) -^> Properties
    echo 4. Definition -^> Password: postgres
    echo 5. Save
)
echo.
pause
