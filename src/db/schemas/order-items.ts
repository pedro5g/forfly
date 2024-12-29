import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { orders } from "./orders";
import { products } from "./products";
import { relations } from "drizzle-orm";

export const orderItems = pgTable("order_items", {
  id: uuid("id")
    .primaryKey()
    .$default(() => randomUUID()),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  priceInCents: integer("price_in_cents").notNull(),
  quantity: integer("quantity").notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => {
  return {
    order: one(orders, {
      fields: [orderItems.orderId],
      references: [orders.id],
      relationName: "order_item_order",
    }),
    product: one(products, {
      fields: [orderItems.productId],
      references: [products.id],
      relationName: "order_item_product",
    }),
  };
});
