import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    ca: fs.readFileSync(
      path.resolve(__dirname, `../${process.env.DB_SSL_CA_PATH}`),
    ),
    rejectUnauthorized: true,
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});
pool
  .getConnection()
  .then((conn) => {
    console.log("🚀 Database pool connected successfully");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });
export { pool };
