import { integer, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { users } from "./users";
import { restaurants } from "./restaurantes";
import { relations } from "drizzle-orm";
import { orderItems } from "./order-items";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "delivering",
  "delivered",
  "canceled",
]);

export const orders = pgTable("orders", {
  id: uuid("id")
    .primaryKey()
    .$default(() => randomUUID()),
  customerId: uuid("customer_id").references(() => users.id, {
    onDelete: "set null",
  }),
  restaurantId: uuid("restaurant_id")
    .notNull()
    .references(() => restaurants.id, {
      onDelete: "cascade",
    }),
  status: orderStatusEnum("status").notNull().default("pending"),
  totalInCents: integer("total_in_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderRelations = relations(orders, ({ one, many }) => {
  return {
    customer: one(users, {
      fields: [orders.customerId],
      references: [users.id],
      relationName: "order_customer",
    }),
    restaurant: one(restaurants, {
      fields: [orders.restaurantId],
      references: [restaurants.id],
      relationName: "order_restaurant",
    }),
    orderItems: many(orderItems),
  };
});
