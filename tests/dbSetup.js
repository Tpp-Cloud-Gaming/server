// dbSetup.js
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { sequelize } from "../src/database/database.js";

let container;

export const startContainer = async () => {
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
};

export const stopContainer = async () => {
  try {
    await container.stop();
    console.log("PostgreSQL container stopped");
  } catch (err) {
    console.log("Error during cleanup: ", err);
  }
};