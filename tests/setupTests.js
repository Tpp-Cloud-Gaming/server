// setupTests.js
import { startContainer, stopContainer } from "./dbSetup.js";

beforeAll(async () => {
  await startContainer();
}, 30000);

afterAll(async () => {
  await stopContainer();
});
