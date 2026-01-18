import { Request, Response } from "express";
import { pool } from "../../database/db";

const deleteTagById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const client = await pool.connect();
  const deleteString = "DELETE FROM tags WHERE id=$1 RETURNING *";

  try {
    const result = await client.query(deleteString, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Tag deleted successfully", tag: result.rows[0] });
  } finally {
    client.release();
  }
};

export default deleteTagById;
