-- Create DB editor --
-- 1. Create role with login capability
CREATE ROLE db_editor WITH LOGIN PASSWORD 'password';

-- 2. Allow connection to specific database
GRANT CONNECT ON DATABASE mydb TO db_editor;

-- 3. Grant access to schema (but without CREATE)
GRANT USAGE ON SCHEMA public TO db_editor;

-- 4. CRUD-privileges on all existing tables
GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public TO db_editor;

-- 5. Privileges on all existing sequences (for INSERT into SERIAL/IDENTITY)
GRANT USAGE, SELECT, UPDATE
ON ALL SEQUENCES IN SCHEMA public TO db_editor;

-- 6. Default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO db_editor;

-- 7. Default privileges for future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO db_editor;