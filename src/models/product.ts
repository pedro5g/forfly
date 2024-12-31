import { sum, eq, desc } from "drizzle-orm";
import { orderItems, orders, products } from "../db/schemas";
import { Base } from "./base";
import type {
  GetPopularProductsReturn,
  IProducts,
} from "./repositories/i-products-repository";

export class Product extends Base implements IProducts {
  async getPopularProducts(
    restaurantId: string
  ): Promise<GetPopularProductsReturn[]> {
    const popularProducts = await this.db
      .select({
        product: products.name,
        amount: sum(orderItems.quantity).mapWith(Number),
      })
      .from(orderItems)
      .leftJoin(orders, eq(orders.id, orderItems.orderId))
      .leftJoin(products, eq(products.id, orderItems.productId))
      .where(eq(orders.restaurantId, restaurantId))
      .groupBy(products.name)
      .orderBy(({ amount }) => desc(amount))
      .limit(5);

    return popularProducts;
  }
}
