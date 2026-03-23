import express from "express";
import chalk from "chalk";
import { pool } from "../../db/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  let connection = null;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT id, name, gender, role,avatar_url FROM groupmember",
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.log(chalk.red(err.name));
    console.log(chalk.red(err.message));
    return res.status(500).json({
      error: "Internal server error get group members",
    });
  } finally {
    if (connection) connection.release();
  }
});
router.post("/", async (req, res) => {
  const { name, gender, role, avatar_url } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });
  }

  let connection = null;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.query(
      "INSERT INTO groupmember (name, gender, role, avatar_url) VALUES (?, ?, ?, ?)",
      [name, gender || "male", role || "member", avatar_url || null],
    );

    return res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        name,
        gender,
        role,
        avatar_url,
      },
    });
  } catch (err) {
    console.log(chalk.red(err.name));
    console.log(chalk.red(err.message));
    return res
      .status(500)
      .json({ error: "Internal server error adding member" });
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
      "SELECT id, name, gender, role,avatar_url FROM groupmember WHERE id=?",
      [id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }
    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.log(chalk.red(err.name));
    console.log(chalk.red(err.message));
    return res.status(500).json({
      error: "Internal server error get group members",
    });
  } finally {
    if (connection) connection.release();
  }
});
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, gender, role, avatar_url } = req.body;

  if (!name && !gender && !role && !avatar_url) {
    return res
      .status(400)
      .json({ success: false, message: "No fields to update" });
  }

  let connection = null;
  try {
    connection = await pool.getConnection();
    const fields = [];
    const values = [];

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }
    if (gender) {
      fields.push("gender = ?");
      values.push(gender);
    }
    if (role) {
      fields.push("role = ?");
      values.push(role);
    }
    if (avatar_url !== undefined) {
      fields.push("avatar_url = ?");
      values.push(avatar_url);
    }
    values.push(id);

    const sql = `UPDATE groupmember SET ${fields.join(", ")} WHERE id = ?`;

    const [result] = await connection.query(sql, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    console.log(chalk.blue(`📝 Member with ID ${id} updated`));
    return res.json({
      success: true,
      message: `Member ${id} updated successfully`,
    });
  } catch (err) {
    console.log(chalk.red(err.name));
    console.log(chalk.red(err.message));
    return res
      .status(500)
      .json({ error: "Internal server error updating member" });
  } finally {
    if (connection) connection.release();
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  let connection = null;

  try {
    connection = await pool.getConnection();

    const [result] = await connection.query(
      "DELETE FROM groupmember WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    return res.json({
      success: true,
      message: `Member ${id} has been deleted`,
    });
  } catch (err) {
    console.log(chalk.red(err.name));
    console.log(chalk.red(err.message));
    return res
      .status(500)
      .json({ error: "Internal server error deleting member" });
  } finally {
    if (connection) connection.release();
  }
});
export default router;
