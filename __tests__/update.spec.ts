import Axios from "axios";
import { expect } from "chai";

import { fetchCnMacros, fetchIntlMacros, fetchKoMacros } from "../src/update";

describe("update", () => {
  const axios = Axios.create();
  it("fetch international macros", async () => {
    const data = await fetchIntlMacros(axios);
    expect(data.length).greaterThan(0);
  }).timeout(50000);

  it("fetch chinese macros", async () => {
    const data = await fetchCnMacros(axios);
    expect(data.length).greaterThan(0);
  }).timeout(10000);

  it("fetch korean macros", async () => {
    const data = await fetchKoMacros(axios);
    expect(data.length).greaterThan(0);
  }).timeout(10000);
});
