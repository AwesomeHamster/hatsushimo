import { App } from "koishi";
import mock from "@koishijs/plugin-mock";
import puppeteer from "@koishijs/plugin-puppeteer";
import memory from "@koishijs/plugin-database-memory";

import * as macrodict from "../src/index";

describe("macrodict", async () => {
  const app = new App();

  app.plugin(mock);
  app.plugin(memory);
  app.plugin(puppeteer);
  app.plugin(macrodict);

  await app.start();

  const client = app.mock.client("123");

  before(async () => {
    app.mock.initUser("123", 4);
  });

  it("should render macro view", async () => {
    await client.shouldReply("macrodict hotbar");
  });
});
