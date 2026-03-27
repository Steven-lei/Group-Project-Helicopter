import express from "express";
import chalk from "chalk";
import { pool } from "../../db/db.js";

const router = express.Router();

router.get("/:userid", async (req, res) => {
  const { userid } = req.params;
  let connection = null;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      "select recipe_id,name,description,base_servings,cooking_time_minutes,difficulty_level,category,image_url from user_favorites left join recipes on user_favorites.recipe_id = recipes.id where user_id=?;",
      [userid],
    );
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        errmsg: `user_favorites with userid:${userid} not found`,
      });
    }
    return res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.log(chalk.red(err.name));
    console.log(chalk.red(err.message));
    return res.status(500).json({
      success: false,
      errmsg: `Internal server error get user favorite recipie with userid ${userid}`,
    });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
