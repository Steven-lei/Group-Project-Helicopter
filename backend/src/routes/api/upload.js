import express from "express";
import chalk from "chalk";
import { authMiddleware } from "../../midware/auth.js";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { s3Client } from "../../db/s3Client.js";
const router = express.Router();

//for debugging, should be protected by authentication middleware
router.post("/", async (req, res) => {
  try {
    const { fileType, fileName } = req.body; // "image/png"
    if (!fileType || !fileType.startsWith("image/")) {
      return res.status(400).json({ error: "Only image files are allowed" });
    }
    const fileKey = `uploads/${Date.now()}-${fileName}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Conditions: [
        ["content-length-range", 0, 5242880], // up to 5MB
        ["starts-with", "$Content-Type", "image/"], // must be image
      ],
      Expires: 300, // expire in 5 mins
      Fields: {
        "Content-Type": fileType,
      },
    });

    return res.json({
      uploadUrl: url,
      fields,
      publicUrl: `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`,
    });
  } catch (err) {
    console.log(chalk.red(err.name));
    console.log(chalk.red(err.message));
    return res.status(500).json({
      error: "Internal server error in creating presigned URL for S3",
    });
  }
});

export default router;
