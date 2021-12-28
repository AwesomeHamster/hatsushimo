import { MockedApp } from "koishi-test-utils";

import * as hitokoto from "../src/hitokoto";

describe("basic", () => {
  const app = new MockedApp({
    mockDatabase: true,
  });

  app.plugin(hitokoto, {
    minLength: 10,
    maxLength: 10,
    template: {
      // to ease testing
      format: "{{hitokoto}} | {{type}}",
    },
  });

  const session = app.session("123");

  before(async () => {
    await app.initUser("123", 4);
  });

  it("should reply hitokoto", async () => {
    await session.shouldReply("hitokoto");
  });

  it("should reply a 10-length a-type hitokoto", async () => {
    await session.shouldReply("hitokoto -t a", /^\w{10} | a$/);
  });

  it("should reply a 20-length hitokoto", async () => {
    await session.shouldReply("hitokoto -l 20 -L 20", /^\w{20} | .*$/);
  });
});
