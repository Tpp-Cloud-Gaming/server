import { createApp } from "../src/app.js";
import request from "supertest";
import { sequelize } from "../src/database/database.js";
import "../src/models/User.js";
import "../src/models/Game.js";
import "../src/models/UserGame.js";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { User } from "../src/models/User.js";
import { Game } from "../src/models/Game.js";

const app = createApp();
let container;
beforeAll(async () => {
  try {
    container = await new PostgreSqlContainer()
      .withPassword(process.env.POSTGRES_PASSWORD)
      .withExposedPorts({
        container: 5432,
        host: process.env.POSTGRES_PORT,
      })
      .withUsername(process.env.POSTGRES_USER)
      .withDatabase(process.env.POSTGRES_DB)
      .start();

    await sequelize.sync({ force: true });
    console.log("Connection to Databases established");
  } catch (err) {
    console.log("Error: ", err);
    throw err;
  }
}, 30000);

afterAll(async () => {
  try {
    await container.stop();
    console.log("PostgreSQL container stopped");
  } catch (err) {
    console.log("Error during cleanup: ", err);
  }
});

beforeEach(async () => {
  await User.destroy({ where: {} });
  await Game.destroy({where: {} });
});

describe("POST /users/:username", () => {
  test("Should respond with a 201 status code", async () => {
    const newUser = {
      email: "hola@gmail.com",
      country: "Argentina",
      longitude: 1.0,
      latitude: 1.0,
    };
    let expectedUser = { ...newUser };
    expectedUser.username = "Axel";
    expectedUser.credits = 0;
    expectedUser.longitude = 1.0;
    expectedUser.latitude = 1.0;
    const response = await request(app)
      .post("/users" + "/Axel")
      .send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(expectedUser);
  });

  test("Should respond with a 409 status code", async () => {
    const newUser = {
      email: "hola@gmail.com",
      country: "Argentina",
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
  test("Should respond with a 400 status code", async () => {
    const newUser = {
      email: "hola@gmail.com",
    };
    let expectedUser = { ...newUser };
    expectedUser.username = "Axel";
    expectedUser.credits = 0;
    const response = await request(app)
      .post("/users" + "/Axel")
      .send(newUser);
    expect(response.statusCode).toBe(400);
  });
});

describe("GET /users/:username", () => {
  test("Should respond with a 200 status code", async () => {
    const newUser = {
      email: "hola@gmail.com",
      country: "Argentina",
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
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expectedUser);
  });

  test("Should respond with a 404 status code", async () => {
    const newUser = {
      email: "hola@gmail.com",
      country: "Argentina",
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
      country: "Argentina",
      latitude: 1.0,
      longitude: 1.0,
    };

    let updatedUser = {...newUser};
    updatedUser.email = "axel@gmail.com";
    updatedUser.country = "Brazil";
    updatedUser.credits = 100;

    let expectedUser = { ...updatedUser };
    expectedUser.username = "Axel";
    expectedUser.latitude = 1.0;
    expectedUser.longitude = 1.0;

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
      country: "Argentina",
      latitude: 1.0,
      longitude: 1.0,
    };

    const updatedUser = {
      email: "axelkelman@gmail.com"
    };


    await request(app)
      .post("/users" + "/Axel")
      .send(newUser);
    const response = await request(app)
      .put("/users" + "/Axel")
      .send(updatedUser);

    expect(response.statusCode).toBe(400);

  });

  test("Should respond with a 404 status code", async () => {
    const newUser = {
      email: "hola@gmail.com",
      country: "Argentina",
      latitude: 1.0,
      longitude: 1.0,
    };

    let updatedUser = {...newUser};
    updatedUser.email = "axel@gmail.com";
    updatedUser.country = "Brazil";
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

//TODO: Move this to another file

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
  test("Should respond with a 200 status code", async () => {
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
    const response = await request(app)
    .get("/games")
    .send(newGame);
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