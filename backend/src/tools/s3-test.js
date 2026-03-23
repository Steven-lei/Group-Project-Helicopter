import { s3Client } from "../db/s3Client.js";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import chalk from "chalk";

(async () => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      MaxKeys: 5, // get the first 5 files
    });

    const { Contents } = await s3Client.send(command);
    if (!Contents || Contents.length === 0) {
      console.log(chalk.green("no files found in S3 bucket"));
      return;
    }
    console.log(
      chalk.green("The following files(top 5) is found in S3 bucket"),
    );
    Contents.map((file) => {
      console.log(
        chalk.white("\t", file.Key, ":"),
        chalk.green(
          `https://${bucketName}.s3.${region}.amazonaws.com/${file.Key}`,
        ),
      );
    });
    console.log(
      chalk.green(
        "The S3 is configured correctly if you can access those files",
      ),
    );
  } catch (err) {
    console.error(chalk.red("❌ unable to connect to S3"));
    console.error(chalk.red(`error: ${err.name}`));
    console.error(chalk.red(`message: ${err.message}`));
  }
})();
