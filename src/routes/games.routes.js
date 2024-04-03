import { Router } from "express";
import { body, validationResult } from "express-validator";
import { GameController } from "../controllers/games.controller.js";

const validateCreateOrUpdateGame = [
  body("category").notEmpty().withMessage("Category is required").bail(),
  body("description").notEmpty().withMessage("Description is required").bail(),
];

export const createGameRouter = () => {
  const router = Router();
  const gameController = new GameController();

  router.get("/games/", gameController.getGames);

  router.post("/games/:name", validateCreateOrUpdateGame, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await gameController.createGame(req, res);
  });

  router.put("/games/:name", validateCreateOrUpdateGame, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await gameController.updateGame(req, res);
  });

  return router;
};
