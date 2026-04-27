-- FAVORITES --
-- Create favorites table --
CREATE TABLE favorites (
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE, -- ID of the user who favorited the image
    image_id INTEGER NOT NULL REFERENCES images (id) ON DELETE CASCADE, -- ID of the favorited image
    added_at TIMESTAMPTZ DEFAULT NOW (), -- timestamp of when record was added
    PRIMARY KEY (user_id, image_id) -- composite primary key
);

-- Add favorite --
INSERT INTO
    favorites (user_id, image_id)
VALUES
    (favUserId, favImageId) RETURNING *;

-- Get favorites by user ID --
SELECT
    image_id,
    added_at
FROM
    favorites
WHERE
    user_id = favUserId
ORDER BY
    added_at DESC;

-- Get favorites by image ID --
SELECT
    user_id,
    added_at
FROM
    favorites
WHERE
    image_id = favImageId
ORDER BY
    added_at DESC;

-- Get count of favorites for a specific image --
SELECT
    COUNT(*) AS favorite_count
FROM
    favorites
WHERE
    image_id = favImageId;

-- Get counts of favorites for multiple images --
SELECT
    image_id,
    COUNT(*) AS favorites_count
FROM
    favorites
WHERE
    image_id IN (
        SELECT DISTINCT
            image_id
        FROM
            favorites
        WHERE
            image_id = favImageId
    )
GROUP BY
    image_id;

-- Remove favorite --
DELETE FROM favorites
WHERE
    user_id = favUserId
    AND image_id = favImageId RETURNING *;