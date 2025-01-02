import { z } from "zod";
import { authMiddleware } from "../../core/middleware/auth-middleware";
import type { FastifyTypeInstance } from "../../types/fastify";

export async function productRoutes(app: FastifyTypeInstance) {
  app.get(
    "/metrics/popular-products",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Product"],
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
      const { restaurantId } = await request.getCurrentUser();

      if (!restaurantId) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const popularProducts = await request.ctx.products.getPopularProducts(
        restaurantId
      );

      reply.status(200).send(popularProducts);
    }
  );
}
