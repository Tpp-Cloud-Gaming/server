import { createApp } from "./app.js";
//import './ws.js';
import { sequelize } from "./database/database.js";
import "./models/User.js";
import "./models/Game.js";
import "./models/UserGame.js";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
import { createServer } from "http";
const require = createRequire(import.meta.url);

const swaggerFile = require("./swagger_output.json");

async function main() {
  // try {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });

  console.log("Connection to Databases established");
  // }
  // catch {
  //   console.log("Unable to connect")
  // }
}

await main();
export const app = createApp();
//export const httpServer = createServer(app);

const PORT = 3000;

app.disable("x-powered-by");

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`);
// });
