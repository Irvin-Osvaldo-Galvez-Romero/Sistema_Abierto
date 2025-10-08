-- =====================================================
-- Script de Configuración de Usuario PostgreSQL
-- Para Sistema Universitario
-- =====================================================

-- 1. Otorgar permisos de LOGIN al usuario univ_app (si ya existe)
ALTER ROLE univ_app WITH LOGIN;

-- 2. Otorgar permisos sobre la base de datos
GRANT ALL PRIVILEGES ON DATABASE sistema_universitario TO univ_app;

-- 3. Otorgar permisos de conexión
GRANT CONNECT ON DATABASE sistema_universitario TO univ_app;

-- 4. Cambiar al contexto de la base de datos sistema_universitario
-- (Ejecuta \c sistema_universitario en psql o cambia la conexión en pgAdmin)

-- 5. Otorgar permisos sobre el esquema public
GRANT ALL ON SCHEMA public TO univ_app;

-- 6. Otorgar permisos sobre todas las tablas existentes
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO univ_app;

-- 7. Otorgar permisos sobre todas las secuencias existentes
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO univ_app;

-- 8. Otorgar permisos sobre todas las funciones existentes
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO univ_app;

-- 9. Configurar permisos por defecto para objetos futuros
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO univ_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO univ_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO univ_app;

-- 10. Verificar que el usuario tiene permisos correctos
SELECT 
    rolname,
    rolcanlogin,
    rolsuper,
    rolcreatedb,
    rolcreaterole
FROM pg_roles 
WHERE rolname = 'univ_app';

-- 11. Verificar permisos sobre la base de datos
SELECT 
    datname,
    has_database_privilege('univ_app', datname, 'CONNECT') as can_connect,
    has_database_privilege('univ_app', datname, 'CREATE') as can_create
FROM pg_database 
WHERE datname = 'sistema_universitario';

-- =====================================================
-- Resultado Esperado:
-- - rolcanlogin debe ser 't' (true)
-- - can_connect debe ser 't' (true)
-- - can_create debe ser 't' (true)
-- =====================================================

