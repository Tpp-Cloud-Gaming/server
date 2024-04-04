import { Router } from "express";
import { body, validationResult } from "express-validator";
import { UserController } from "../controllers/users.controller.js";

const validateCreateUser = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid Email")
    .bail(),
  body("latitude").notEmpty().withMessage("Latitude is required").bail(),
  body("longitude").notEmpty().withMessage("Longitude is required").bail(),
];

let validateUpdateUser = [...validateCreateUser];
validateUpdateUser.push(
  body("credits").notEmpty().withMessage("Credits is required").bail(),
);

const validateCreteOrUpdateUserGames = [
  body("*.gamename")
    .notEmpty()
    .withMessage("Gamename is required for each item")
    .bail(),
  body("*.path").notEmpty().withMessage("Path is required for each item"),
];

export const createUserRouter = () => {
  const router = Router();
  const userController = new UserController();

  router.get("/users/:username", userController.getUser);

  router.post("/users/:username", validateCreateUser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await userController.createUser(req, res);
  });

  router.put("/users/:username", validateUpdateUser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await userController.updateUser(req, res);
  });

  router.post(
    "/users/:username/games",
    validateCreteOrUpdateUserGames,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      await userController.createorUpdateUserGames(req, res);
    },
  );

  return router;
};
