import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import tagsRouter from "./routes/api/tagsRouter";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/tags", tagsRouter);

// Optional: Error handler middleware
app.use(errorHandler);

export default app;
