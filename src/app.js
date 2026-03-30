import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  assignRequestId,
  createRateLimiter,
  setSecurityHeaders,
} from "./middlewares/security.middleware.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/task.routes.js";

const app = express();

app.use(assignRequestId);
app.use(setSecurityHeaders);
app.use(createRateLimiter({ windowMs: 60_000, max: 150 }));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);

app.get("/", (_req, res) => {
  res.status(200).json({ success: true, message: "Project Management API" });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
