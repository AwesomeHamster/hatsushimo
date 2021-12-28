import { MockedApp } from "koishi-test-utils";

import * as hitokoto from "../src/hitokoto";

const app = new MockedApp({
  mockDatabase: true,
});

app.plugin(hitokoto);

const session = app.session("123");

describe("hitokoto", () => {
  before(async () => {
    await app.initUser("123", 4);
  });

  it("get hitokoto", async () => {
    await session.shouldReply("hitokoto");
  });
});
