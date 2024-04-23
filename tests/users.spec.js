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

describe("POST /users/:username", () => {
  test("Should create user correctly", async () => {
    const newUser = {
      email: "hola@gmail.com",
      longitude: 1.0,
      latitude: 1.0,
    };
    let expectedUser = { ...newUser };
    expectedUser.username = "Axel";
    expectedUser.credits = 0;
    const response = await request(app)
      .post("/users" + "/Axel")
      .send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(expectedUser);
  });

  test("Should not permit creation of existing username", async () => {
    const newUser = {
      email: "hola@gmail.com",
      longitude: 1.0,
      latitude: 1.0,
    };
    let expectedUser = { ...newUser };
    expectedUser.username = "Axel";
    expectedUser.credits = 0;
    await request(app)
      .post("/users" + "/Axel")
      .send(newUser);
    const response = await request(app)
      .post("/users" + "/Axel")
      .send(newUser);
    expect(response.statusCode).toBe(409);
  });

  test("Should note create user without lat and lon", async () => {
    const newUser = {
      email: "hola@gmail.com",
    };
    const response = await request(app)
      .post("/users" + "/Axel")
      .send(newUser);
    expect(response.statusCode).toBe(400);
  });
});

describe("GET /users/:username", () => {
  test("Should get user with no games", async () => {
    const newUser = {
      email: "hola@gmail.com",
      latitude: 1.0,
      longitude: 1.0,
    };
    let expectedUser = { ...newUser };
    expectedUser.username = "Axel";
    expectedUser.credits = 0;
    expectedUser.latitude = 1.0;
    expectedUser.longitude = 1.0;
    await request(app)
      .post("/users" + "/Axel")
      .send(newUser);
    const response = await request(app).get("/users" + "/Axel");

    const expectedUserGames = [];

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      user: expectedUser,
      userGames: expectedUserGames,
    });
  });

  test("Should get user with associated games", async () => {
    const newUser = {
      email: "hola@gmail.com",
      latitude: 1.0,
      longitude: 1.0,
    };
    let expectedUser = { ...newUser };
    expectedUser.username = "Axel";
    expectedUser.credits = 0;
    expectedUser.latitude = 1.0;
    expectedUser.longitude = 1.0;
    await request(app)
      .post("/users" + "/Axel")
      .send(newUser);

    const newGame = {
      category: "rpg",
      description: "El lol",
    };
    await request(app)
      .post("/games" + "/league of legends")
      .send(newGame);

    const userGames = [{ gamename: "league of legends", path: "c:/lol" }];
    await request(app)
      .post("/users" + "/Axel" + "/games")
      .send(userGames);

    const expectedUserGames = [
      { gamename: "league of legends", path: "c:/lol" },
    ];

    const response = await request(app).get("/users" + "/Axel");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      user: expectedUser,
      userGames: expectedUserGames,
    });
  });

  test("Should not work with invalid username", async () => {
    const newUser = {
      email: "hola@gmail.com",
    };
    let expectedUser = { ...newUser };
    expectedUser.username = "Axel";
    expectedUser.credits = 0;
    await request(app)
      .post("/users" + "/Axel")
      .send(newUser);
    const response = await request(app).get("/users" + "/Axel2");
    expect(response.statusCode).toBe(404);
  });
});

describe("PUT /users/:username", () => {
  test("Should respond with a 200 status code", async () => {
    const newUser = {
      email: "hola@gmail.com",
      latitude: 1.0,
      longitude: 1.0,
    };

    let updatedUser = { ...newUser };
    updatedUser.username = "Axel2";
    updatedUser.credits = 100;

    let expectedUser = { ...updatedUser };

    await request(app)
      .post("/users" + "/Axel")
      .send(newUser);
    const response = await request(app)
      .put("/users" + "/Axel")
      .send(updatedUser);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expectedUser);
  });

  test("Should respond with a 400 status code", async () => {
    const newUser = {
      email: "hola@gmail.com",
      latitude: 1.0,
      longitude: 1.0,
    };

    const updatedUser = {
      email: "axelkelman@gmail.com",
    };

    await request(app)
      .post("/users" + "/Axel")
      .send(newUser);
    const response = await request(app)
      .put("/users" + "/Axel")
      .send(updatedUser);

    expect(response.statusCode).toBe(400);
  });

  test("Should not update with invalid username", async () => {
    const newUser = {
      email: "hola@gmail.com",
      latitude: 1.0,
      longitude: 1.0,
    };

    let updatedUser = { ...newUser };
    updatedUser.email = "axel@gmail.com";
    updatedUser.credits = 100;

    await request(app)
      .post("/users" + "/Axel")
      .send(newUser);
    const response = await request(app)
      .put("/users" + "/Axel2")
      .send(updatedUser);

    expect(response.statusCode).toBe(404);
  });
});
