-- CART_ITEMS --
-- Create cart_items table
CREATE TABLE cart_items (
    cart_id INTEGER NOT NULL REFERENCES carts (id) ON DELETE CASCADE,
    image_id INTEGER NOT NULL REFERENCES images (id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    PRIMARY KEY (cart_id, image_id)
);

-- Add cart item
INSERT INTO
    cart_items (cart_id, image_id)
VALUES
    (cartId, imageId);

-- Remove cart item
DELETE FROM cart_items
WHERE
    cart_id = cartId
    AND image_id = imageId;

-- Get all items in a cart
SELECT
    *
FROM
    cart_items
WHERE
    cart_id = cartId;

-- Clear all items from a cart
DELETE FROM cart_items
WHERE
    cart_id = cartId;

-- Count items in a cart
SELECT
    COUNT(*)
FROM
    cart_items
WHERE
    cart_id = cartId;

-- Check if an item exists in a cart
SELECT
    EXISTS (
        SELECT
            1
        FROM
            cart_items
        WHERE
            cart_id = cartId
            AND image_id = imageId
    );