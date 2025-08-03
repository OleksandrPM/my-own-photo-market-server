import express, { Request, Response } from "express";
import cors from "cors";
import { Pool } from "pg";
import { poolConfig } from "./database/db";

const app = express();

app.use(express.json());
app.use(cors());

const pool = new Pool(poolConfig);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/tags", async (req, res, next) => {
  try {
    const requestString = "SELECT * FROM tags ORDER BY tag ASC";
    const result = await pool.query(requestString);

    res.status(201).json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Optional: Error handler middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
