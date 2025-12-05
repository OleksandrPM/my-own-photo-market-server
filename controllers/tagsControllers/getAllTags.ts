import { Request, Response } from "express";
import { pool } from "../../database/db";

const getAllTags = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  const requestString = "SELECT * FROM tags ORDER BY tag ASC";

  try {
    const result = await client.query(requestString);
    res.status(200).json(result.rows);
  } finally {
    client.release();
  }
};

export default getAllTags;
