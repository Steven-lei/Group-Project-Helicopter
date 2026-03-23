import express from "express";
// Adds routes.
import dishes from "./dishes.js";
import upload from "./upload.js";
import group from "./groups.js";
const router = express.Router();

router.use("/dishes", dishes);
router.use("/upload", upload);
router.use("/group", group);
export default router;
