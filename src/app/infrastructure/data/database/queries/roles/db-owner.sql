-- Create DB owner --
-- 1. Create role with login capability
CREATE ROLE db_owner
WITH
    LOGIN PASSWORD 'password';
