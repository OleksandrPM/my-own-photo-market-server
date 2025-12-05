import { Request, Response } from "express";
import { pool } from "../../database/db";

const addTag = async (req: Request, res: Response): Promise<void> => {
  const { tag } = req.body;
  const client = await pool.connect();
  const insertString = "INSERT INTO tags (tag) VALUES ($1) RETURNING *";

  try {
    const result = await client.query(insertString, [tag]);
    res.status(201).json(result.rows[0]);
  } finally {
    client.release();
  }
};

export default addTag;
