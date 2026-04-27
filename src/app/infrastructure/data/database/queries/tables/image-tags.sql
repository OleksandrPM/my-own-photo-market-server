-- IMAGE_TAGS --
-- Create image_tags table
CREATE TABLE image_tags (
    image_id INTEGER NOT NULL REFERENCES images (id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
    PRIMARY KEY (image_id, tag_id)
);

-- Insert a new image-tag association
INSERT INTO
    image_tags (image_id, tag_id)
VALUES
    (imageId, tagId) RETURNING *;

-- Get images by tag ID
SELECT
    i.*
FROM
    images i
    JOIN image_tags it ON i.id = it.image_id
WHERE
    it.tag_id = tagId;

-- Get tags by image ID
SELECT
    t.*
FROM
    tags t
    JOIN image_tags it ON t.id = it.tag_id
WHERE
    it.image_id = imageId;