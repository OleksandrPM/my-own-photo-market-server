-- PURCHASES --
-- Crate purchases table, TODO: add transactions data
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id) ON DELETE SET NULL,
    image_id INTEGER REFERENCES images (id) ON DELETE SET NULL,
    guest_email TEXT, -- if purchased by a guest user
    purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    price NUMERIC(10, 2) NOT NULL
);

-- Add purchase
INSERT INTO
    purchases (user_id, image_id, guest_email, price)
VALUES
    (userId, imageId, guestEmail, price) RETURNING *;

-- Get all purchases
SELECT
    id,
    user_id,
    image_id,
    guest_email,
    purchased_at,
    price
FROM
    purchases;

-- Get purchases by user
SELECT
    id,
    user_id,
    image_id,
    guest_email,
    purchased_at,
    price
FROM
    purchases
WHERE
    user_id = userId;

-- Get purchases by image
SELECT
    id,
    user_id,
    image_id,
    guest_email,
    purchased_at,
    price
FROM
    purchases
WHERE
    image_id = imageId;

-- Get purchases by guest email
SELECT
    id,
    user_id,
    image_id,
    guest_email,
    purchased_at,
    price
FROM
    purchases
WHERE
    guest_email = guestEmail;