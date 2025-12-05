import { Request, Response } from "express";
import { pool } from "../../database/db";

const getTagByName = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.params;
  const client = await pool.connect();
  const requestString = "SELECT * FROM tags WHERE tag=$1";

  try {
    const result = await client.query(requestString, [name]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    res.status(200).json(result.rows[0]);
  } finally {
    client.release();
  }
};

export default getTagByName;
