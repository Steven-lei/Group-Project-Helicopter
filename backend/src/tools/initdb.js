import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { pool } from "../db/db.js";

(async () => {
  let connection = null;
  try {
    connection = await pool.getConnection();
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const sqlPath = path.join(__dirname, "sql/init.sql");
    const sqlContent = await fs.readFile(sqlPath, "utf-8");

    await connection.query(sqlContent);

    console.log(chalk.green("✨ Database schema synchronized from init.sql"));
  } catch (err) {
    console.error(chalk.red("❌ [DB] Init failed!"));
    console.error(chalk.red("errcode:", err.code));
    console.error(chalk.red("errmsg:", err.message));
  } finally {
    if (connection) connection.release();
    pool.end();
  }
})();
