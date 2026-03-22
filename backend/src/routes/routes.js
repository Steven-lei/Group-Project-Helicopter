import express from "express";
const router = express.Router();

import api from "./api/index.js";
router.use("/api", api);
router.get("/", function (req, res) {
  res.send(
    "backend is running...If you see this without manual deploying, the CI/CD is working",
  );
});
export default router;
