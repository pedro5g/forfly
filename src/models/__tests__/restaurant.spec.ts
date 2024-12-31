import { eq } from "drizzle-orm";
import { db } from "../../db/connection";
import { restaurants, users } from "../../db/schemas";
import { Context } from "../context";
import { Restaurant } from "../restaurant";

const userIds: string[] = [];
const restaurantIds: string[] = [];

describe("Restaurant unit test", async () => {
  afterEach(async () => {
    while (userIds.length) {
      const userId = userIds.pop();
      if (userId) {
        await db.delete(users).where(eq(users.id, userId));
      }
    }
    while (restaurantIds.length) {
      const restaurantId = restaurantIds.pop();
      if (restaurantId) {
        await db.delete(restaurants).where(eq(restaurants.id, restaurantId));
      }
    }
  });

  test("[Restaurant] initialize", () => {
    const ctx = new Context();
    const restaurant = new Restaurant(ctx);
    assert(restaurant);
  });

  test("insert new restaurant", async () => {
    const data = {
      managerName: "Jon doe",
      email: "test2@gmail.com",
      phone: "+55 15 00000 0000",
    };

    const ctx = new Context();
    const restaurant = new Restaurant(ctx);

    const res = await ctx.manager.insert(data);
    userIds.push(res.id);
    const restaurantRes = await restaurant.insert({
      restaurantName: "pepito pizzaria",
      managerId: res.id,
    });
    restaurantIds.push(restaurantRes.id);
    expect(restaurantRes.id).toBeTruthy();

    const restaurantOnDatabase = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantRes.id);
      },
    });

    expect(restaurantOnDatabase).toBeTruthy();
    expect(restaurantOnDatabase).toEqual(
      expect.objectContaining({
        id: restaurantRes.id,
        name: "pepito pizzaria",
        managerId: res.id,
      })
    );
  });

  test("find restaurant by id", async () => {
    const data = {
      managerName: "Jon doe",
      email: "test2@gmail.com",
      phone: "+55 15 00000 0000",
    };

    const ctx = new Context();
    const restaurant = new Restaurant(ctx);

    const res = await ctx.manager.insert(data);
    userIds.push(res.id);
    const restaurantRes = await restaurant.insert({
      restaurantName: "pepito pizzaria",
      managerId: res.id,
    });
    restaurantIds.push(restaurantRes.id);
    expect(restaurantRes.id).toBeTruthy();

    const restaurantFound = await restaurant.getRestaurantById(
      restaurantRes.id
    );

    expect(restaurantFound).toBeTruthy();
    expect(restaurantFound).toEqual(
      expect.objectContaining({
        id: restaurantRes.id,
        name: "pepito pizzaria",
        managerId: res.id,
      })
    );
  });
});
