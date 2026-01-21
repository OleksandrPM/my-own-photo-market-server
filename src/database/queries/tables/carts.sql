-- CARTS --
-- Create carts table
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id) ON DELETE SET NULL,
    session_id TEXT, -- for guests
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
);

-- Index to quickly find cart by user_id or session_id
CREATE INDEX idx_carts_user_session ON carts (user_id, session_id);

-- Add cart
INSERT INTO
    carts (user_id, session_id)
VALUES
    (userId, sessionId) RETURNING *;

-- Get cart by user_id or session_id
SELECT
    *
FROM
    carts
WHERE
    user_id = userId
    OR session_id = sessionId
LIMIT
    1;

-- Update cart's updated_at timestamp
UPDATE carts
SET
    updated_at = NOW ()
WHERE
    id = cartId;

-- Delete cart by id
DELETE FROM carts
WHERE
    id = cartId RETURNING *;