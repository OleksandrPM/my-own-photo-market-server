import { Request, Response } from "express";
import { pool } from "../../database/db";

const updateTag = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { tag } = req.body;
  const client = await pool.connect();
  const updateString = "UPDATE tags SET tag=$1 WHERE id=$2 RETURNING *";

  try {
    const result = await client.query(updateString, [tag, id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Tag updated successfully", tag: result.rows[0] });
  } finally {
    client.release();
  }
};

export default updateTag;
