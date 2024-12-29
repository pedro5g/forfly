import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { restaurants } from "./restaurantes";
import { orders } from "./orders";

export const userRoleEnum = pgEnum("user_role", ["manager", "customer"]);

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .$default(() => randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: userRoleEnum("role").default("customer").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userRelations = relations(users, ({ one, many }) => {
  return {
    managedRestaurant: one(restaurants, {
      fields: [users.id],
      references: [restaurants.managerId],
      relationName: "managed_restaurant",
    }),
    orders: many(orders),
  };
});
