-- TAGS --
-- Create tags table --
CREATE TABLE tags (id SERIAL PRIMARY KEY, tag TEXT NOT NULL UNIQUE);

-- Get all tags --
SELECT
  *
FROM
  tags
ORDER BY
  tag ASC;

-- Get tag by id --
SELECT
  tag
FROM
  tags
WHERE
  id = tagId;

-- Get tag by name --
SELECT
  *
FROM
  tags
WHERE
  tag = tagName;

-- Add tag --
INSERT INTO
  tags (tag)
VALUES
  ('tag') RETURNING *;

-- Add multiple tags --
INSERT INTO
  tags (tag)
VALUES
  ('tag1'),
  ('tag2'),
  ('tag3') RETURNING *;

-- Update tag --
UPDATE tags
SET
  tag = newTagName
WHERE
  id = tagId RETURNING *;

-- Delete tag by id --
DELETE FROM tags
WHERE
  id = tagId RETURNING *;

-- Delete tag by name --
DELETE FROM tags
WHERE
  tag = tagName RETURNING *;