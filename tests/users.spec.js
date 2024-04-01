import { createApp } from "../src/app.js";
import request from "supertest";
import { sequelize } from "../src/database/database.js";
import "../src/models/User.js";
import "../src/models/Game.js";
import "../src/models/UserGame.js";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { User } from "../src/models/User.js";

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
});

describe("POST /users/:username", () => {
  test("Should respond with a 201 status code", async () => {
    const newUser = {
      email: "hola@gmail.com",
      country: "Argentina",
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
    };
    let expectedUser = { ...newUser };
    expectedUser.username = "Axel";
    expectedUser.credits = 0;
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
