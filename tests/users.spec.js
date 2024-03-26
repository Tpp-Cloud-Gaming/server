import app from "../src/app.js";
import  request from "supertest";

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