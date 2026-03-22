import express from "express";

const router = express.Router();

// Adds routes.
import dishes from "./dishes.js";
router.use("/dishes", dishes);

export default router;
