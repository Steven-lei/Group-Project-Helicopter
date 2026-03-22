import { getAuth } from "../../configs/firebase.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const idToken = authHeader.split("Bearer ")[1];
    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(401).send("Invalid authentication");
    }
  } else {
    res.status(401).send("Invalid Token");
  }
};
