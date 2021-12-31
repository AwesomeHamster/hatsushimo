import * as puppeteer from "koishi-plugin-puppeteer";
import { MockedApp } from "koishi-test-utils";

import * as macrodict from "../src/index";

describe("macrodict", async () => {
  const app = new MockedApp({
    mockDatabase: true,
  });

  app.plugin(puppeteer);
  app.plugin(macrodict);

  await app.start();

  const session = app.session("123");
  it("should render macro view", async () => {
    await session.shouldReply("macrodict hotbar");
  });
});
