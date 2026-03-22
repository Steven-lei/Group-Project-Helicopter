import chalk from "chalk";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
export const initFireBase = () => {
  console.log(chalk.blue("initializing firebase..."));
  try {
    const encodedConfig = process.env.FIREBASE_CONFIG_BASE64;
    if (!encodedConfig) {
      throw new Error("FIREBASE_CONFIG_BASE64 is missing");
    }

    // decoded to JSON
    const decodedString = Buffer.from(encodedConfig, "base64").toString(
      "utf-8",
    );
    const serviceAccount = JSON.parse(decodedString);

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log(chalk.green("Firebase Admin initialized successfully"));
    }
  } catch (error) {
    console.log(
      chalk.red.bold("failed to initialize Firebase Admin:", error.message),
    );
  }
};
export const adminApp = () => (admin.apps.length === 0 ? null : admin.app());
export { getAuth };
