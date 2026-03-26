import express from "express";
// Adds routes.
import dishes from "./dishes.js";
import upload from "./upload.js";
import group from "./groups.js";
import users from "./users.js";
import recipes from "./recipes.js";
const router = express.Router();

router.use("/users", users);
router.use("/recipes", recipes);
router.use("/dishes", dishes);
router.use("/upload", upload);
router.use("/group", group);
export default router;
