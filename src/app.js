import express from "express";
import { createUserRouter } from "./routes/users.routes.js";
import { verifyFirebaseToken } from "./middlewares/firebase.auth.js";

export const createApp = () => {
  const app = express();

  //middlewares
  app.use(express.json());

  app.use(verifyFirebaseToken);

  app.use(createUserRouter());

  return app;
};
