import { eq } from "drizzle-orm";
import { db } from "../../db/connection";
import {
  users,
  restaurants,
  orders,
  products,
  orderItems,
} from "../../db/schemas";
import { Context } from "../context";
import { Product } from "../product";

const userIds: string[] = [];
const restaurantIds: string[] = [];
const productIds: string[] = [];
const orderIds: string[] = [];
describe("Product unit tests", async () => {
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
    while (orderIds.length) {
      const orderId = orderIds.pop();
      if (orderId) {
        await db.delete(orders).where(eq(orders.id, orderId));
      }
    }
    while (productIds.length) {
      const productId = productIds.pop();
      if (productId) {
        await db.delete(products).where(eq(products.id, productId));
      }
    }
  });

  beforeEach(async () => {
    // mock a manager
    const [manager] = await db
      .insert(users)
      .values({
        name: "jhon",
        email: "testProduct@gmail.com",
        phone: "15 997766 3300",
        role: "manager",
      })
      .returning({ id: users.id });
    userIds.push(manager.id);
    const [costumer] = await db
      .insert(users)
      .values({
        name: "jhon",
        email: "client2@gmail.com",
        phone: "15 997766 3300",
        role: "customer",
      })
      .returning({ id: users.id });
    userIds.push(costumer.id);

    // mock a restaurant
    const [restaurant] = await db
      .insert(restaurants)
      .values({
        managerId: manager.id,
        name: "pepito foods",
      })
      .returning({ id: restaurants.id });
    restaurantIds.push(restaurant.id);

    const [product] = await db
      .insert(products)
      .values({
        name: "pizza",
        restaurantId: restaurant.id,
        priceInCents: 490,
      })
      .returning({ id: products.id });

    productIds.push(product.id);

    const [order] = await db
      .insert(orders)
      .values({
        restaurantId: restaurant.id,
        customerId: costumer.id,
        totalInCents: 500,
        status: "pending",
      })
      .returning({ id: orders.id });

    orderIds.push(order.id);

    await db
      .insert(orderItems)
      .values({
        orderId: order.id,
        quantity: 5,
        productId: product.id,
        priceInCents: 600,
      })
      .returning({ id: orderItems.id });
  });
  test("[Product] initialize", () => {
    const ctx = new Context();
    const product = new Product(ctx);
    assert(product);
  });

  test("get Popular Products", async () => {
    const ctx = new Context();
    const product = new Product(ctx);

    const res = await product.getPopularProducts(restaurantIds[0]);

    expect(res).toBeTruthy();
    expect(res).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          product: "pizza",
          amount: 5,
        }),
      ])
    );
  });
});
