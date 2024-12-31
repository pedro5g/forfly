import { Base } from "../base";
import { Context } from "../context";

describe("Base unit tests", () => {
  test("[Base] initialize", () => {
    const ctx = new Context();
    const base = new Base(ctx);

    assert(base);
    assert(base.context);
    assert(base.db);
  });
});
