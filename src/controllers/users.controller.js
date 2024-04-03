import { User } from "../models/User.js";

export class UserController {
  constructor() {}

  getUser = async (req, res) => {
    const username = req.params.username;
    const user = await User.findOne({ where: { username: username } });
    if (user === null) {
      return res
        .status(404)
        .json({ message: `Username '${username}' not found` });
    } else {
      res.json(user);
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
      return res
        .status(409)
        .json({ message: `Username '${username}' already exists` });
    }
  };

  updateUser = async (req, res) => {
    const username = req.params.username;
    const { email, credits, longitude, latitude } = req.body;
    try {
      const updatedUser = await User.findOne({ where: { username: username } });
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
        .json({ message: `Username '${username}' not found` });
    }
  };
}
