import express from "express";
import { createUserRouter } from "./api/routes/users.routes.js";
import { createGameRouter } from "./api/routes/games.routes.js";
import { createPaymentRouter } from "./api/routes/payments.routes.js";
import { verifyFirebaseToken } from "./middlewares/firebase.auth.js";

export const createApp = () => {
  const app = express();

  //middlewares
  app.use(express.json());

  //app.use(verifyFirebaseToken);

  app.use(createUserRouter());
  app.use(createGameRouter());
  app.use(createPaymentRouter());

  return app;
};
