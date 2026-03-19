import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/db_connect.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000;

connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
