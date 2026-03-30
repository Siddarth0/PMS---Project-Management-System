import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/db_connect.js";
import mongoose from "mongoose";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000;

await connectDB();

const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    await mongoose.connection.close();
    console.log("HTTP server and MongoDB connection closed.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forcefully shutting down after timeout.");
    process.exit(1);
  }, 10_000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
