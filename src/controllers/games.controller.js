import { Game } from "../models/Game.js";

export class GameController {
  constructor() {}

  getGames = async (req, res) => {
    const games = await Game.findAll();
    res.json(games);
  };

  createGame = async (req, res) => {
    const name = req.params.name;
    const { category,description,image_1,image_2,image_3 } = req.body;
    try {
      const newGame = await Game.create({
        name,
        category,
        description,
        image_1,
        image_2,
        image_3
      });
      return res.status(201).json(newGame);
    } catch (error) {
      return res
        .status(409)
        .json({ message: `Game '${name}' already exists` });
    }
  };

  updateGame = async (req, res) => {
    const name = req.params.name;
    const { category,description,image_1,image_2,image_3 } = req.body;
    try {
      const updatedGame = await Game.findOne({ where: { name: name } });
      updatedGame.set({
        name,
        category,
        description,
        image_1,
        image_2,
        image_3
      });
      await updatedGame.save();
      return res.status(200).json(updatedGame);
    } catch (error) {
      return res
        .status(404)
        .json({ message: `Game '${name}' not found` });
    }
  };
}
