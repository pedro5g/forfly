import { sum, eq, desc, and, inArray, ilike, count } from "drizzle-orm";
import { orderItems, orders, products, restaurants } from "../db/schemas";
import { Base } from "./base";
import type {
  CreateProductParams,
  GetPopularProductsReturn,
  IProducts,
  ListProductsParams,
  ListProductsReturn,
  ProductType,
  UpdateMenuParams,
} from "./repositories/i-products-repository";

export class Product extends Base implements IProducts {
  async createProduct(
    data: CreateProductParams & { restaurantId: string }
  ): Promise<{ id: string }> {
    const [product] = await this.db
      .insert(products)
      .values({
        name: data.name,
        priceInCents: data.price * 100, // covert to cents
        description: data.description,
        restaurantId: data.restaurantId,
      })
      .returning({ id: restaurants.id });

    return product;
  }

  async updateMenu({
    restaurantId,
    deletedProductIds,
    newOrUpdatedProducts,
  }: UpdateMenuParams): Promise<{ id: string }[] | void> {
    if (deletedProductIds.length > 0) {
      await this.db
        .delete(products)
        .where(
          and(
            inArray(products.id, deletedProductIds),
            eq(products.restaurantId, restaurantId)
          )
        );
    }

    type ProductWithId = Required<UpdateMenuParams["newOrUpdatedProducts"][0]>;
    type ProductWithoutId = Omit<
      UpdateMenuParams["newOrUpdatedProducts"][0],
      "id"
    >;

    // [is] it's a ts operator that infer type if conditional is true

    const updateProducts = newOrUpdatedProducts.filter(
      (product): product is ProductWithId => !!product.id
    );

    // if id field exists, then update it
    if (updateProducts.length > 0) {
      await Promise.all([
        updateProducts.map((product) => {
          return this.db
            .update(products)
            .set({
              name: product.name,
              description: product.description,
              priceInCents: product.price * 100, // convert to cents
            })
            .where(
              and(
                eq(products.id, product.id),
                eq(products.restaurantId, restaurantId)
              )
            );
        }),
      ]);
    }

    const newProducts = newOrUpdatedProducts.filter(
      (product): product is ProductWithoutId => !product.id
    );

    // if id field don't exists, then create it
    if (newProducts.length > 0) {
      return await this.db
        .insert(products)
        .values(
          newProducts.map((product) => {
            return {
              name: product.name,
              description: product.description,
              priceInCents: product.price * 100,
              restaurantId,
            };
          })
        )
        .returning({ id: products.id });
    }
  }

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

  async listProducts({
    restaurantId,
    pageIndex,
    productName,
  }: ListProductsParams): Promise<ListProductsReturn> {
    const baseProductsQuery = this.db
      .select()
      .from(products)
      .where(
        and(
          eq(products.restaurantId, restaurantId),
          productName ? ilike(products.name, `%${productName}%`) : undefined
        )
      );

    const [[amountOfProductsQuery], allProducts] = await Promise.all([
      this.db
        .select({ count: count() })
        .from(baseProductsQuery.as("baseProductsQuery")),
      this.db
        .select()
        .from(baseProductsQuery.as("baseProductsQuery"))
        .offset((pageIndex - 1) * 10)
        .limit(10)
        .orderBy(({ name }) => desc(name)),
    ]);

    const amountOfProducts = amountOfProductsQuery.count;

    return { products: allProducts, totalCount: amountOfProducts };
  }
}
