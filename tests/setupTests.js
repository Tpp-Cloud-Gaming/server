// setupTests.js
import { startContainer, stopContainer } from "./dbSetup.js";

beforeAll(async () => {
  await startContainer();
});

afterAll(async () => {
  await stopContainer();
});