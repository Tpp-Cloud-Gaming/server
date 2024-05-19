import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

initializeApp({
  credential: applicationDefault(),
});

export const verifyFirebaseToken = async (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    return next();
  }

  if (req.path === "/payments/notif") {
    return next();
  }

  const idToken = req.headers.authorization;

  if (!idToken) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.user = decodedToken; // Attach the decoded token to the request object for further use
    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return res.status(403).send("Forbidden");
  }
};
