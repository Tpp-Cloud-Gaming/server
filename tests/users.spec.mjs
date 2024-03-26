import app from "../src/app.js";
import  request from "supertest";
import { PostgreSQLContainer } from "testcontainers";

beforeAll(async () => {
    try {
        const container = await new PostgreSQLContainer().start()
        process.env.POSTGRES_HOST = container.getHost();
        process.env.POSTGRES_PORT = container.getPort();

    } catch (err) {
        console.log('Error: ', err);
        throw err;
    }
});


describe ("POST /users", () => {
    const newUser = {        
        name: "Axel",
        email: "hola@gmail.com"
    }
    test("Should respond with a 200 status code", async () => {
        const response = await request(app).post("/users").send(newUser);
        expect(response.statusCode).toBe(200);
    })
})