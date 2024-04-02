import { Router } from "express";
import { body, validationResult } from "express-validator";
import { UserController } from "../controllers/users.controller.js";

const validateCreateUser = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid Email"),
  body("country").notEmpty().withMessage("Country is required").bail(),
];

let validateUpdateUser = [...validateCreateUser];
validateUpdateUser.push(
  body("credits").notEmpty().withMessage("Credits is required").bail(),
);

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

  return router;
};
