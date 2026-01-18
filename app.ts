import express from "express";
import session from "express-session";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import tagsRouter from "./routes/api/tagsRouter";

const app = express();

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET || "abracadabra",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/tags", tagsRouter);

// Optional: Error handler middleware
app.use(errorHandler);

export default app;
