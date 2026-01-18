import { Request, Response } from "express";
import { pool } from "../../database/db";

const getTagsByName = async (req: Request, res: Response): Promise<void> => {
  // Expecting tags array in query or body instead of params
  // const { tags } = req.body; // e.g. { "tags": ["tag1", "tag2", "tag3"] }

  const { tags } = req.params;
  const client = await pool.connect();
  const requestString = "SELECT * FROM tags WHERE tag = ANY($1::text[])";

  if (!Array.isArray(tags) || tags.length === 0) {
    res.status(400).json({ message: "Tags must be a non-empty array" });
    return;
  }

  try {
    const result = await client.query(requestString, [tags]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: "No tags found" });
      return;
    }
    // Del
    console.log(result.rows);

    // res.status(200).json(result.rows);
  } finally {
    client.release();
  }
};

export default getTagsByName;
