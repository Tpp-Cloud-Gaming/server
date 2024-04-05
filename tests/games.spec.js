import { createApp } from "../src/app.js";
import request from "supertest";
import "../src/models/User.js";
import "../src/models/Game.js";
import "../src/models/UserGame.js";
import { User } from "../src/models/User.js";
import { Game } from "../src/models/Game.js";
import { UserGame } from "../src/models/UserGame.js";

   
beforeEach(async () => {
  await User.destroy({ where: {} });
  await Game.destroy({ where: {} });
  await UserGame.destroy({ where: {} });
});

const app = createApp();

describe("POST /games/:name", () => {
    test("Should respond with a 201 status code", async () => {
      const newGame = {
        category: "rpg",
        description: "El lol",
      };
      let expectedGame = { ...newGame };
      expectedGame.name = "Lol";
      expectedGame.image_1 = null;
      expectedGame.image_2 = null;
      expectedGame.image_3 = null;
  
      const response = await request(app)
        .post("/games" + "/Lol")
        .send(newGame);
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(expectedGame);
    });
  
    test("Should respond with a 409 status code", async () => {
      const newGame = {
        category: "rpg",
        description: "El lol",
      };
      let otherGame = { ...newGame };
      otherGame.name = "Lol";
      otherGame.image_1 = null;
      otherGame.image_2 = null;
      otherGame.image_3 = null;
  
      await request(app)
        .post("/games" + "/Lol")
        .send(newGame);
      const response = await request(app)
        .post("/games" + "/Lol")
        .send(otherGame);
      expect(response.statusCode).toBe(409);
    });
  
    test("Should respond with a 404 status code", async () => {
      const newGame = {
        category: "rpg",
      };
  
      const response = await request(app)
        .post("/games" + "/Lol")
        .send(newGame);
      expect(response.statusCode).toBe(400);
    });
  });
  
  describe("GET /games", () => {
    test("Should get game", async () => {
      const newGame = {
        category: "rpg",
        description: "El lol",
      };
      let expectedGame = { ...newGame };
      expectedGame.name = "Lol";
      expectedGame.image_1 = null;
      expectedGame.image_2 = null;
      expectedGame.image_3 = null;
  
      await request(app)
        .post("/games" + "/Lol")
        .send(newGame);
      const response = await request(app).get("/games").send(newGame);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([expectedGame]);
    });
  });
  
  describe("GET /games", () => {
    test("Should get user with games associated", async () => {
      const newGame = {
        category: "rpg",
        description: "El lol",
      };
      let expectedGame = { ...newGame };
      expectedGame.name = "Lol";
      expectedGame.image_1 = null;
      expectedGame.image_2 = null;
      expectedGame.image_3 = null;
  
      await request(app)
        .post("/games" + "/Lol")
        .send(newGame);
      const response = await request(app).get("/games").send(newGame);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([expectedGame]);
    });
  });
  
  describe("PUT /games/:name", () => {
    test("Should respond with a 200 status code", async () => {
      const newGame = {
        category: "rpg",
        description: "El lol",
      };
      let updatedGame = { ...newGame };
      updatedGame.name = "Lol";
      updatedGame.image_1 = "asd";
      updatedGame.image_2 = null;
      updatedGame.image_3 = null;
  
      await request(app)
        .post("/games" + "/Lol")
        .send(newGame);
      const response = await request(app)
        .put("/games" + "/Lol")
        .send(updatedGame);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(updatedGame);
    });
  
    test("Should respond with a 404 status code", async () => {
      const newGame = {
        category: "rpg",
        description: "El lol",
      };
      let updatedGame = { ...newGame };
      updatedGame.name = "Lol";
      updatedGame.image_1 = "asd";
      updatedGame.image_2 = null;
      updatedGame.image_3 = null;
  
      await request(app)
        .post("/games" + "/Lol")
        .send(newGame);
      const response = await request(app)
        .put("/games" + "/Lol2")
        .send(updatedGame);
      expect(response.statusCode).toBe(404);
    });
  });
  
  // TODO: Add more usergame tests and move to other file
  describe("POST user/:username/games", () => {
    test("Should respond with 200", async () => {
      const newGame = {
        category: "rpg",
        description: "El lol",
      };
  
      const newUser = {
        email: "hola@gmail.com",
        longitude: 1.0,
        latitude: 1.0,
      };
  
      await request(app)
        .post("/games" + "/lol")
        .send(newGame);
      await request(app)
        .post("/users" + "/axel")
        .send(newUser);
  
      const userGames = [
        {
          gamename: "lol",
          path: "c",
        },
      ];
  
      let expectedUserGames = [...userGames];
      expectedUserGames[0].username = "axel";
  
      const response = await request(app)
        .post("/users" + "/axel" + "/games")
        .send(userGames);
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expectedUserGames);
    });
  });
  