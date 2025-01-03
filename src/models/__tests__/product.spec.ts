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

  test("create product", async () => {
    const ctx = new Context();
    const product = new Product(ctx);

    const resProduct = await product.createProduct({
      name: "pizza of cheese",
      description: "test description",
      price: 40,
      restaurantId: restaurantIds[0],
    });
    productIds.push(resProduct.id);
    expect(resProduct).toBeTruthy();

    const productOnDatabase = await db.query.products.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, resProduct.id);
      },
    });

    expect(productOnDatabase).toBeTruthy();
    expect(productOnDatabase).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "pizza of cheese",
        description: "test description",
        restaurantId: restaurantIds[0],
        priceInCents: 40,
      })
    );
  });

  test("update menu", async () => {
    const ctx = new Context();
    const product = new Product(ctx);

    const datas = [
      {
        name: "pizza of cheese 1",
        description: "test description",
        priceInCents: 40,
        restaurantId: restaurantIds[0],
      },
      {
        name: "pizza of cheese 2",
        description: "test description",
        priceInCents: 40,
        restaurantId: restaurantIds[0],
      },
    ];

    const productsRes = await db
      .insert(products)
      .values(datas.map((data) => data))
      .returning({ id: products.id });
    productIds.push(...productsRes.map((prod) => prod.id));

    const res = await product.updateMenu({
      restaurantId: restaurantIds[0],
      deletedProductIds: [productsRes[0].id],
      newOrUpdatedProducts: [
        {
          name: "pizza of cheese 3",
          description: "test description",
          price: 40,
        },
      ],
    });

    if (res) {
      productIds.push(res[0].id);
    }

    const product1WasDeleted = await db.query.products.findFirst({
      where(fields, { eq }) {
        return eq(fields.name, "pizza of cheese 1");
      },
    });

    expect(product1WasDeleted).toBeUndefined();

    const product2WasPreserved = await db.query.products.findFirst({
      where(fields, { eq }) {
        return eq(fields.name, "pizza of cheese 2");
      },
    });
    expect(product2WasPreserved).toBeTruthy();

    const product3WasCreated = await db.query.products.findFirst({
      where(fields, { eq }) {
        return eq(fields.name, "pizza of cheese 3");
      },
    });

    expect(product3WasCreated).toBeTruthy();
    expect(product3WasCreated).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "pizza of cheese 3",
        description: "test description",
        restaurantId: restaurantIds[0],
        priceInCents: 4000,
      })
    );
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
