import {createApp} from "../src/app.js";
import  request from "supertest";
import { sequelize } from "../src/database/database.js";
import "../src/models/User.js"
import "../src/models/Game.js"
import "../src/models/UserGame.js"
import {PostgreSqlContainer} from "@testcontainers/postgresql";

const app = createApp();
let container
beforeAll(async () => {
    try {
        
        container = await new PostgreSqlContainer()
            .withPassword(process.env.POSTGRES_PASSWORD)
            .withExposedPorts({
                container: 5432,
                host: process.env.POSTGRES_PORT
            })
            .withUsername(process.env.POSTGRES_USER)
            .withDatabase(process.env.POSTGRES_DB)
            .start()
         
        await sequelize.sync({force:true});
        console.log("Connection to Databases established");
        
    } catch (err) {
        console.log('Error: ', err);
        throw err;
    }
}, 30000);

 
afterAll(async () => {
    try {
        await container.stop();
        console.log("PostgreSQL container stopped");
    } catch (err) {
        console.log('Error during cleanup: ', err);
    }
});


describe ("POST /users", () => {
    const newUser = {        
        name: "Axel",
        email: "hola@gmail.com"
    }
    test("Should respond with a 200 status code", async () => {
        const response = await request(app).post("/users").send(newUser);
        console.log(response)
        expect(response.statusCode).toBe(200);
    })
});