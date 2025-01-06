import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { restaurants } from "./restaurantes";
import { relations } from "drizzle-orm";
import { orderItems } from "./order-items";

export const products = pgTable("products", {
  id: uuid("id")
    .primaryKey()
    .$default(() => randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  priceInCents: integer("price_in_cents").notNull(),
  restaurantId: uuid("restaurant_id")
    .notNull()
    .references(() => restaurants.id, {
      onDelete: "cascade",
    }),
  available: boolean().notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productsRelations = relations(products, ({ one, many }) => {
  return {
    restaurants: one(restaurants, {
      fields: [products.restaurantId],
      references: [restaurants.id],
      relationName: "product_restaurant",
    }),
    orderItems: many(orderItems),
  };
});
