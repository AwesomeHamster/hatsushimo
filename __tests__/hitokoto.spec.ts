import { App } from "koishi";
import mock from "@koishijs/plugin-mock";
import memory from "@koishijs/plugin-database-memory";

import * as hitokoto from "../src";

describe("basic", () => {
  const app = new App();

  app.plugin(mock);
  app.plugin(memory);

  app.plugin(hitokoto, {
    minLength: 10,
    maxLength: 10,
    template: {
      // to ease testing
      format: "{{hitokoto}} | {{type}}",
    },
  });

  const client = app.mock.client("123");

  before(async () => {
    await app.mock.initUser("123", 4);
  });

  it("should reply hitokoto", async () => {
    await client.shouldReply("hitokoto");
  });

  it("should reply a 10-length a-type hitokoto", async () => {
    await client.shouldReply("hitokoto -t a", /^\w{10} | a$/);
  });

  it("should reply a 20-length hitokoto", async () => {
    await client.shouldReply("hitokoto -l 20 -L 20", /^\w{20} | .*$/);
  });
});
