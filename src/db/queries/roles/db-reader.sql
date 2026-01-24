-- Create DB reader --
-- 1. Create role with login capability
CREATE ROLE db_reader WITH LOGIN PASSWORD 'password';

-- 2. Allow connection to specific database
GRANT CONNECT ON DATABASE mydb TO db_reader;

-- 3. Grant access to schema (but without CREATE)
GRANT USAGE ON SCHEMA public TO db_reader;

-- 4. Only read privileges for all existing tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO db_reader;

-- 5. Privileges on all existing sequences (for viewing values)
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO db_reader;

-- 6. Default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO db_reader;

-- 7. Default privileges for future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON SEQUENCES TO db_reader;