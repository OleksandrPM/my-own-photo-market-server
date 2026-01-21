-- Create DB owner --
-- 1. Create role with login capability
CREATE ROLE db_owner WITH LOGIN PASSWORD 'password';

-- 2. Allow connection to specific database
GRANT CONNECT ON DATABASE mydb TO db_owner;

-- 3. Grant privileges on schema (public or another)
GRANT USAGE, CREATE ON SCHEMA public TO db_owner;

-- 4. Full privileges on all existing tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO db_owner;

-- 5. Full privileges on all existing functions
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO db_owner;

-- 6. Full privileges on all existing types
GRANT ALL PRIVILEGES ON ALL TYPES IN SCHEMA public TO db_owner;

-- 7. Full privileges on all existing sequences (important for SERIAL/IDENTITY)
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO db_owner;

-- 8. Default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON TABLES TO db_owner;

-- 9. Default privileges for future functions
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON FUNCTIONS TO db_owner;

-- 10. Default privileges for future types
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON TYPES TO db_owner;

-- 11. Default privileges for future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL PRIVILEGES ON SEQUENCES TO db_owner;