import { z } from "zod";
import { logger } from "../../core/logger";
import { authMiddleware } from "../../core/middleware/auth-middleware";
import type { FastifyTypeInstance } from "../../types/fastify";

export async function userRoutes(app: FastifyTypeInstance) {
  app.get(
    "/me",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["User"],
        description: "Get user profile",
        response: {
          200: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string().email(),
            phone: z.string().nullable(),
            role: z.enum(["manager", "customer"]),
            createdAt: z.date(),
            updatedAt: z.date(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { userId } = await request.getCurrentUser();

      const user = await request.ctx.user.findById(userId);

      if (!user) {
        logger.error(`Something very wrong happening`);
        throw new Error("User not found!");
      }

      reply.status(200).send(user);
    }
  );
}
