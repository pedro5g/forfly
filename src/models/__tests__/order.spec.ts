import { eq } from "drizzle-orm";
import { db } from "../../db/connection";
import {
  orderItems,
  orders,
  products,
  restaurants,
  users,
} from "../../db/schemas";
import { Context } from "../context";
import { Order } from "../order";
import dayjs from "dayjs";

const userIds: string[] = [];
const restaurantIds: string[] = [];
const productIds: string[] = [];
const orderIds: string[] = [];

describe("Order unit tests", () => {
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
        email: "test3@gmail.com",
        phone: "15 997766 3300",
        role: "manager",
      })
      .returning({ id: users.id });
    userIds.push(manager.id);
    const [costumer] = await db
      .insert(users)
      .values({
        name: "jhon",
        email: "client@gmail.com",
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

  test("[Order] initialize", () => {
    const ctx = new Context();
    const order = new Order(ctx);
    assert(order);
  });

  test("Create order", async () => {
    const ctx = new Context();
    const order = new Order(ctx);

    const res = await order.createOrder({
      restaurantId: restaurantIds[0],
      customerId: userIds[1],
      items: [{ productId: productIds[0], quantity: 2 }],
    });

    orderIds.push(res.id);

    const orderOnDatabase = await db.query.orders.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, res.id);
      },
    });

    expect(orderOnDatabase).toBeTruthy();

    const orderItemOnDatabase = await db.query.orderItems.findFirst({
      where(fields, { eq }) {
        return eq(fields.orderId, res.id);
      },
    });

    expect(orderItemOnDatabase).toBeTruthy();
  });

  test("get Order With Details", async () => {
    const ctx = new Context();
    const order = new Order(ctx);

    const res = await order.getOrderWithDetails({
      orderId: orderIds[0],
      restaurantId: restaurantIds[0],
    });

    expect(res).toBeTruthy();
    expect(res).toEqual(
      expect.objectContaining({
        status: "pending",
        totalInCents: 500,
        customer: {
          name: "jhon",
          phone: "15 997766 3300",
          email: "client@gmail.com",
        },
        orderItems: [
          expect.objectContaining({
            priceInCents: 600,
            quantity: 5,
            product: {
              name: "pizza",
            },
          }),
        ],
      })
    );
  });

  test("get Moths Receipts", async () => {
    const ctx = new Context();
    const order = new Order(ctx);

    const res = await order.getMothsReceipts(restaurantIds[0]);
    expect(res).toBeTruthy();
    expect(res).toEqual(
      expect.objectContaining({
        receipt: expect.any(Number),
        diffFromLastMonth: expect.any(Number),
      })
    );
  });
  test("get Month Orders Amount", async () => {
    const ctx = new Context();
    const order = new Order(ctx);

    const res = await order.getMonthOrdersAmount(restaurantIds[0]);
    expect(res).toBeTruthy();
    expect(res).toEqual(
      expect.objectContaining({
        amount: expect.any(Number),
        diffFromLastMonth: expect.any(Number),
      })
    );
  });
  test("get Day Orders Amount", async () => {
    const ctx = new Context();
    const order = new Order(ctx);

    const res = await order.getDayOrdersAmount(restaurantIds[0]);
    expect(res).toBeTruthy();
    expect(res).toEqual(
      expect.objectContaining({
        amount: expect.any(Number),
        diffFromLastMonth: expect.any(Number),
      })
    );
  });
  test("get Month Canceled Orders Amount", async () => {
    const ctx = new Context();
    const order = new Order(ctx);

    const res = await order.getMonthCanceledOrdersAmount(restaurantIds[0]);
    expect(res).toBeTruthy();
    expect(res).toEqual(
      expect.objectContaining({
        amount: expect.any(Number),
        diffFromLastMonth: expect.any(Number),
      })
    );
  });
  test("get Daily Receipt In Period", async () => {
    const ctx = new Context();
    const order = new Order(ctx);

    const res = await order.getDailyReceiptInPeriod(restaurantIds[0], {
      from: dayjs().toString(),
      to: dayjs().add(6, "days").toString(),
    });

    expect(res).toBeTruthy();
    expect(res).toEqual([
      expect.objectContaining({
        date: expect.any(String),
        receipt: expect.any(Number),
      }),
    ]);
  });

  test("get Orders", async () => {
    const ctx = new Context();
    const order = new Order(ctx);

    let res = await order.getOrders(restaurantIds[0], { pageIndex: 1 });

    expect(res).toBeTruthy();
    expect(res).toEqual(
      expect.objectContaining({
        orders: expect.arrayContaining([
          expect.objectContaining({
            status: "pending",
            createdAt: expect.any(Date),
            orderId: orderIds[0],
            customerName: "jhon",
            total: 500,
          }),
        ]),
        totalCount: 1,
      })
    );
    res = await order.getOrders(restaurantIds[0], {
      pageIndex: 1,
      status: "pending",
    });

    expect(res).toBeTruthy();
    expect(res).toEqual(
      expect.objectContaining({
        orders: expect.arrayContaining([
          expect.objectContaining({
            status: "pending",
            createdAt: expect.any(Date),
            orderId: orderIds[0],
            customerName: "jhon",
            total: 500,
          }),
        ]),
        totalCount: 1,
      })
    );
    res = await order.getOrders(restaurantIds[0], {
      pageIndex: 1,
      customerName: "jhon",
    });

    expect(res).toBeTruthy();
    expect(res).toEqual(
      expect.objectContaining({
        orders: expect.arrayContaining([
          expect.objectContaining({
            status: "pending",
            createdAt: expect.any(Date),
            orderId: orderIds[0],
            customerName: "jhon",
            total: 500,
          }),
        ]),
        totalCount: 1,
      })
    );
    res = await order.getOrders(restaurantIds[0], {
      pageIndex: 1,
      customerName: "canceled",
    });

    expect(res).toBeTruthy();
    expect(res).toEqual(
      expect.objectContaining({
        orders: [],
        totalCount: 0,
      })
    );
    res = await order.getOrders(restaurantIds[0], {
      pageIndex: 1,
      orderId: orderIds[0],
    });

    expect(res).toBeTruthy();
    expect(res).toEqual(
      expect.objectContaining({
        orders: expect.arrayContaining([
          expect.objectContaining({
            status: "pending",
            createdAt: expect.any(Date),
            orderId: orderIds[0],
            customerName: "jhon",
            total: 500,
          }),
        ]),
        totalCount: 1,
      })
    );
    res = await order.getOrders(restaurantIds[0], {
      pageIndex: 1,
      customerName: "jh",
    });

    expect(res).toBeTruthy();
    expect(res).toEqual(
      expect.objectContaining({
        orders: expect.arrayContaining([
          expect.objectContaining({
            status: "pending",
            createdAt: expect.any(Date),
            orderId: orderIds[0],
            customerName: "jhon",
            total: 500,
          }),
        ]),
        totalCount: 1,
      })
    );

    res = await order.getOrders(restaurantIds[0], {
      pageIndex: 2,
      customerName: "jh",
    });

    expect(res).toBeTruthy();
    expect(res).toEqual(
      expect.objectContaining({
        orders: [],
        totalCount: 1,
      })
    );
  });

  test("find By OrderId And RestaurantId", async () => {
    const ctx = new Context();
    const order = new Order(ctx);

    const res = await order.findByOrderIdAndRestaurantId(
      orderIds[0],
      restaurantIds[0]
    );

    expect(res).toBeTruthy();
    expect(res).toEqual(
      expect.objectContaining({
        status: "pending",
        id: expect.any(String),
        createdAt: expect.any(Date),
        customerId: userIds[1],
        restaurantId: restaurantIds[0],
        totalInCents: 500,
      })
    );
  });

  test("approve Order", async () => {
    const ctx = new Context();
    const order = new Order(ctx);

    await order.approveOrder(orderIds[0]);

    const orderOnDatabase = await db.query.orders.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, orderIds[0]);
      },
    });

    expect(orderOnDatabase?.status).toBe("processing");
  });
  test("cancel Order", async () => {
    const ctx = new Context();
    const order = new Order(ctx);

    await order.cancelOrder(orderIds[0]);

    const orderOnDatabase = await db.query.orders.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, orderIds[0]);
      },
    });

    expect(orderOnDatabase?.status).toBe("canceled");
  });
  test("dispatch Order", async () => {
    const ctx = new Context();
    const order = new Order(ctx);

    await order.dispatchOrder(orderIds[0]);

    const orderOnDatabase = await db.query.orders.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, orderIds[0]);
      },
    });

    expect(orderOnDatabase?.status).toBe("delivering");
  });
  test("deliver Order", async () => {
    const ctx = new Context();
    const order = new Order(ctx);

    await order.deliverOrder(orderIds[0]);

    const orderOnDatabase = await db.query.orders.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, orderIds[0]);
      },
    });

    expect(orderOnDatabase?.status).toBe("delivered");
  });
});
