import express from "express";
import chalk from "chalk";
import { pool } from "../../db/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let connection = null;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      "select id,name,description,base_servings,cooking_time_minutes,difficulty_level,category,image_url from recipes;",
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, errmsg: `no recipes are found` });
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
      errmsg: `Internal server error get recipes`,
    });
  } finally {
    if (connection) connection.release();
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  let connection = null;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      "select id,name,description,base_servings,cooking_time_minutes,difficulty_level,category,image_url from recipes where id = ?;",
      [id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, errmsg: `recipe with id:${id} not found` });
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
      errmsg: `Internal server error get recipes with id ${id}`,
    });
  } finally {
    if (connection) connection.release();
  }
});
router.get("/:id/steps", async (req, res) => {
  const { id } = req.params;
  let connection = null;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      "select recipe_steps.step_number,recipe_steps.instruction,recipe_steps.image_url from recipes left join recipe_steps on recipes.id = recipe_steps.recipe_id where recipe_id = ? order by recipe_steps.step_number;",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        errmsg: `recipe steps with id:${id} not found`,
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
      errmsg: `Internal server error get recipes_steps with id ${id}`,
    });
  } finally {
    if (connection) connection.release();
  }
});
router.get("/:id/ingredients", async (req, res) => {
  const { id } = req.params;
  let connection = null;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      "select recipe_ingredients.ingredient_id,ingredients.name,recipe_ingredients.quantity,recipe_ingredients.quantity,recipe_ingredients.unit,recipe_ingredients.is_optional from recipes left join recipe_ingredients on recipes.id = recipe_ingredients.recipe_id inner join ingredients on recipe_ingredients.ingredient_id = ingredients.id where recipes.id = ?",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        errmsg: `recipe ingredients with id:${id} not found`,
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
      errmsg: `Internal server error get ingredients with id ${id}`,
    });
  } finally {
    if (connection) connection.release();
  }
});
export default router;
