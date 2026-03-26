import express from "express";
import chalk from "chalk";
import { pool } from "../../db/db.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  let connection = null;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT email,first_name,last_name from users WHERE id = ?",
      [id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, errmsg: `User with ID:${id} not found` });
    }
    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.log(chalk.red(err.name));
    console.log(chalk.red(err.message));
    return res.status(500).json({
      success: false,
      errmsg: `Internal server error get user with id ${id}`,
    });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
