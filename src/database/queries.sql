
-- USERS --
-- Create user --
CREATE USER user_name WITH PASSWORD 'secure_password';

-- Restrict user's rights --
/* (Do not grant UPDATE if you want to prevent editing existing rows. 
Do not grant ALTER, DROP, or TRUNCATE — these allow structural changes.) */
GRANT SELECT, INSERT, DELETE ON table_name TO user_name;

-- TAGS --
-- Create table --
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  tag TEXT NOT NULL UNIQUE
);

-- Get all tags --
SELECT * 
FROM tags 
ORDER BY tag ASC;

-- Get tag by id --
SELECT tag 
FROM tags 
WHERE id = tagId;

-- Add tag --
INSERT INTO tags (tag) 
VALUES ('tag') 
RETURNING *;