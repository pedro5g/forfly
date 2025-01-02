import { faker } from "@faker-js/faker";
import {
  authLinks,
  orderItems,
  orders,
  products,
  restaurants,
  users,
} from "./schemas";
import { db } from "./connection";
import { logger } from "../core/logger";
import { randomUUID } from "node:crypto";

await db.delete(users);
await db.delete(restaurants);
await db.delete(orderItems);
await db.delete(orders);
await db.delete(products);
await db.delete(authLinks);

logger.info("✅ Database reset!");

const [customer1, customer2] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: "customer",
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: "customer",
    },
  ])
  .returning();

logger.info("✅ Created customers!");

const [manager] = await db
  .insert(users)
  .values([
    {
      name: "Pedro Luiz",
      email: "testAccount@gmail.com",
      role: "manager",
    },
  ])
  .returning({
    id: users.id,
  });

logger.info("✅ Created manager!");

const [restaurant] = await db
  .insert(restaurants)
  .values([
    {
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      managerId: manager.id,
    },
  ])
  .returning();

logger.info("✅ Created restaurant!");

function generateProduct() {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    restaurantId: restaurant.id,
    priceInCents: Number(faker.commerce.price({ min: 190, max: 490, dec: 0 })),
  };
}

const availableProducts = await db
  .insert(products)
  .values([
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
  ])
  .returning();

logger.info("✅ Created products!");

type OrderItemInsert = typeof orderItems.$inferInsert;
type OrderInsert = typeof orders.$inferInsert;

const orderItemsToInsert: OrderItemInsert[] = [];
const ordersToInsert: OrderInsert[] = [];

for (let i = 0; i < 200; i++) {
  const orderId = randomUUID();

  const orderProducts = faker.helpers.arrayElements(availableProducts, {
    min: 1,
    max: 3,
  });
  let totalInCents = 0;

  orderProducts.forEach((orderProduct) => {
    const quantity = faker.number.int({ min: 1, max: 3 });

    totalInCents += orderProduct.priceInCents * quantity;

    orderItemsToInsert.push({
      orderId,
      productId: orderProduct.id,
      priceInCents: orderProduct.priceInCents,
      quantity,
    });
  });

  ordersToInsert.push({
    id: orderId,
    customerId: faker.helpers.arrayElement([customer1.id, customer2.id]),
    restaurantId: restaurant.id,
    totalInCents,
    status: faker.helpers.arrayElement([
      "pending",
      "processing",
      "delivering",
      "delivered",
      "canceled",
    ]),
    createdAt: faker.date.recent({ days: 40 }),
  });
}

await db.insert(orders).values(ordersToInsert);
await db.insert(orderItems).values(orderItemsToInsert);

logger.info("✅ Created orders!");
logger.info("Database seeded successfully! 🔥🔥🔥🔥🔥");

process.exit(0);
