-- IMAGES --
-- Create orientation type --
CREATE TYPE orientation_type AS ENUM ('horizontal', 'vertical', 'square');

-- Create images table --
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL, -- image name/title
    description TEXT, -- optional image description
    path_orig TEXT NOT NULL, -- URL of original image
    path_preview TEXT NOT NULL, -- URL of preview image
    path_thumb TEXT NOT NULL, -- URL of thumbnail image        
    type TEXT NOT NULL, -- e.g. 'jpeg', 'png', 'raw'
    orientation orientation_type NOT NULL, -- e.g. 'horizontal', 'vertical', 'square'
    size INTEGER, -- optional, bytes
    width INTEGER NOT NULL, -- px
    height INTEGER NOT NULL, -- px
    created_at TIMESTAMPTZ NOT NULL, -- timestamp of when photo was taken
    added_at TIMESTAMPTZ DEFAULT NOW (), -- timestamp of when record was added
    price NUMERIC(10, 2) NOT NULL -- money, e.g. 19.99
);

-- Add image --
INSERT INTO
    images (
        name,
        description,
        path_orig,
        path_preview,
        path_thumb,
        type,
        orientation,
        size,
        width,
        height,
        created_at,
        price
    )
VALUES
    (
        imageName,
        imageDescription,
        imagePathOrig,
        imagePathPreview,
        imagePathThumb,
        imageType,
        imageOrientation,
        imageSize,
        imageWidth,
        imageHeight,
        imageCreatedAt,
        imagePrice
    ) RETURNING *;

-- Get thumbnail images --
SELECT
    id,
    name,
    description,
    path_preview,
    path_thumb,
    width,
    height,
    price,
    (
        SELECT
            COUNT(*)
        FROM
            favorites
        WHERE
            image_id = images.id
    ) AS favorite_count -- count of favorites for each image
FROM
    images
ORDER BY -- here we choose the value to sort by
    added_at DESC;

-- Get thumbnail images with pagination --
SELECT
    id,
    name,
    description,
    path_preview,
    path_thumb,
    width,
    height,
    price
FROM
    images
ORDER BY
    added_at DESC -- here we choose the value to sort by
LIMIT -- pageSize and pageOffset are integers
    pageSize
OFFSET
    pageOffset;

-- Get filtered thumbnail images --
SELECT
    id,
    name,
    description,
    path_preview,
    path_thumb,
    width,
    height,
    price
FROM
    images
WHERE
    orientation = filterOrientation -- filterOrientation is of type orientation_type
ORDER BY
    added_at DESC -- here we choose the value to sort by
LIMIT -- pageSize and pageOffset are integers
    pageSize
OFFSET
    pageOffset;

-- Update image --
UPDATE images
SET
    name = imageName,
    description = imageDescription,
    path_orig = imagePathOrig,
    path_preview = imagePathPreview,
    path_thumb = imagePathThumb,
    type = imageType,
    orientation = imageOrientation,
    size = imageSize,
    width = imageWidth,
    height = imageHeight,
    created_at = imageCreatedAt,
    price = imagePrice
WHERE
    id = imageId RETURNING *;

-- Delete image --
DELETE FROM images
WHERE
    id = imageId RETURNING *;

-- TODO: Add more queries as needed, e.g., get image by ID, get purchased images, get favorite images etc.