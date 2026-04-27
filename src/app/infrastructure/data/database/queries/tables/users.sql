-- USERS --
-- User roles --
CREATE TYPE role AS ENUM ('admin', 'user');

-- Create users table --
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  username TEXT, -- optional
  password_hash TEXT NOT NULL, -- hashed password
  user_role role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
  avatar_url TEXT -- optional
);

-- Get all users --
SELECT
  *
FROM
  users;

-- Get user by id --
SELECT
  *
FROM
  users
WHERE
  id = userId;

-- Get user by email --
SELECT
  *
FROM
  users
WHERE
  email = userEmail;

-- Add user --
INSERT INTO
  users (
    email,
    username,
    password_hash,
    user_role,
    avatar_url
  )
VALUES
  (
    'userEmail',
    'userName',
    'passwordHash',
    'userRole',
    'avatarUrl'
  ) RETURNING *;

-- Update user --
UPDATE users
SET
  email = userEmail,
  username = userName,
  password_hash = passwordHash,
  user_role = userRole,
  avatar_url = avatarUrl
WHERE
  id = userId RETURNING *;

-- Delete user by id --
DELETE FROM users
WHERE
  id = userId RETURNING *;

-- Delete user by email --
DELETE FROM users
WHERE
  email = userEmail RETURNING *;
