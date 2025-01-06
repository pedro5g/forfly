import { z } from "zod";
import { authMiddleware } from "../../core/middleware/auth-middleware";
import type { FastifyTypeInstance } from "../../types/fastify";

export async function productRoutes(app: FastifyTypeInstance) {
  app.get(
    "/metrics/popular-products",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Products"],
        description: "Get popular products metrics",
        response: {
          400: z
            .object({ message: z.string().default("Order not found") })
            .describe("Order not found"),
          200: z.array(
            z.object({
              product: z.string().nullable(),
              amount: z.number(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const restaurantId = await request.getManagerRestaurantId();

      const popularProducts = await request.ctx.products.getPopularProducts(
        restaurantId
      );

      reply.status(200).send(popularProducts);
    }
  );

  app.post(
    "/products",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Products"],
        description: "Create a new product",
        body: z.object({
          name: z.string(),
          description: z.string().optional(),
          isAvailable: z.boolean(),
          price: z.number(),
        }),
        response: {
          200: z.null().describe("product was created"),
        },
      },
    },
    async (request, reply) => {
      const restaurantId = await request.getManagerRestaurantId();
      const { name, description, price, isAvailable } = request.body;

      await request.ctx.products.createProduct({
        name,
        description,
        price,
        restaurantId,
        available: isAvailable,
      });

      reply.status(200).send();
    }
  );

  app.get(
    "/products",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Products"],
        description: "Get products",
        querystring: z.object({
          pageIndex: z.coerce.number().default(1),
          productName: z.string().optional(),
        }),
        response: {
          200: z.object({
            products: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                priceInCents: z.number(),
                available: z.boolean(),
                description: z.string().nullable(),
                createdAt: z.date(),
                updatedAt: z.date(),
              })
            ),
            meta: z.object({
              pageIndex: z.number(),
              perPage: z.number(),
              totalCount: z.number(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const restaurantId = await request.getManagerRestaurantId();
      const { productName, pageIndex } = request.query;

      const { totalCount, products } = await request.ctx.products.listProducts({
        restaurantId,
        productName,
        pageIndex,
      });

      reply.status(200).send({
        products: products,
        meta: {
          pageIndex,
          perPage: 10,
          totalCount: totalCount,
        },
      });
    }
  );

  app.get(
    "/products/all",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Products"],
        description: "Get all restaurant products",
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              name: z.string(),
              priceInCents: z.number(),
              available: z.boolean(),
              description: z.string().nullable(),
              createdAt: z.date(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const restaurantId = await request.getManagerRestaurantId();

      const products = await request.ctx.products.listAllProduct(restaurantId);

      reply.status(200).send(products);
    }
  );
}
