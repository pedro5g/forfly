import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { orders } from "./orders";
import { products } from "./products";

export const restaurants = pgTable("restaurants", {
  id: uuid("id")
    .primaryKey()
    .$default(() => randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  managerId: uuid("manager_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const restaurantesRelations = relations(restaurants, ({ one, many }) => {
  return {
    manager: one(users, {
      fields: [restaurants.managerId],
      references: [users.id],
      relationName: "restaurant_manager",
    }),
    orders: many(orders),
    products: many(products),
  };
});
