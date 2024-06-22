import { User } from "../../models/User.js";
import { UserGame } from "../../models/UserGame.js";

export class UserController {
  constructor() {}

  getUser = async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({
      where: { username: req.params.username },
    });

    const userGames = await UserGame.findAll({
      where: { username: username },
      attributes: ["path", "gamename"],
    });

    if (user === null) {
      return res
        .status(404)
        .json({ message: `Username '${username}' not found` });
    } else {
      user.credits = user.credits / 60;
      res.json({ user, userGames });
    }
  };

  createUser = async (req, res) => {
    const username = req.params.username;
    const { email, longitude, latitude } = req.body;
    try {
      const newUser = await User.create({
        username,
        email,
        longitude,
        latitude,
      });
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(409).json({
        message: `Username '${username}' or email '${email}' already exists`,
      });
    }
  };

  updateUser = async (req, res) => {
    const oldUsername = req.params.username;
    const { username, email, credits, longitude, latitude } = req.body;
    try {
      const updatedUser = await User.findOne({
        where: { username: oldUsername },
      });
      updatedUser.set({
        username,
        email,
        longitude,
        latitude,
        credits,
      });
      await updatedUser.save();
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res
        .status(404)
        .json({ message: `Username '${oldUsername}' not found` });
    }
  };

  createorUpdateUserGames = async (req, res) => {
    let returnCode;
    const userAlreadyExists = await UserGame.destroy({
      where: { username: req.params.username },
    });

    try {
      const gamesToinsert = req.body.map((obj) => ({
        ...obj,
        ["username"]: req.params.username,
      }));
      const newGames = await UserGame.bulkCreate(gamesToinsert, {
        updateOnDuplicate: ["path"],
      });

      if (userAlreadyExists === null) {
        returnCode = 201;
      } else {
        returnCode = 200;
      }
      return res.status(returnCode).json(newGames);
    } catch {
      //TODO: Check the error and make it more specific
      return res
        .status(404)
        .json({ message: `Username or gamename does not exist` });
    }
  };

  updateMercadopagoEmail = async (req, res) => {
    const username = req.params.username;
    const { mercadopago_mail } = req.body;
    try {
      const updatedUser = await User.findOne({
        where: { username: username },
      });
      updatedUser.set({
        mercadopago_mail,
      });
      await updatedUser.save();
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res
        .status(404)
        .json({ message: `Username '${username}' not found` });
    }
  };
}
