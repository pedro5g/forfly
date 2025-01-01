import { Context } from "../context";

describe("Context unit test", () => {
  test("[Context] initialize", async () => {
    const ctx = new Context();

    assert(ctx);
    assert(ctx.manager);
    assert(ctx.user);
    assert(ctx.authLinks);
    assert(ctx.orders);
    assert(ctx.products);
    assert(ctx.restaurants);
  });
});
