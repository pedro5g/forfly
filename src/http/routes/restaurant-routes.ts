import { z } from "zod";
import type { FastifyTypeInstance } from "../../types/fastify";

export async function restaurantRoutes(app: FastifyTypeInstance) {
  app.post(
    "/restaurants",
    {
      schema: {
        description: "Register Restaurant",
        tags: ["Restaurant"],
        body: z.object({
          managerName: z.string().min(3).max(30),
          restaurantName: z.string().min(3).max(30),
          email: z.string().email(),
          phone: z.string().regex(/^\(\d{2}\) 9\d{4}-\d{4}$/),
        }),
        response: {
          204: z.null().describe("restaurant created"),
          400: z.object({
            message: z
              .string()
              .default("Email already exists")
              .describe("Email already exists"),
          }),
        },
      },
    },
    async (request, reply) => {
      const { restaurantName, managerName, email, phone } = request.body;

      const emailExists = !!(await request.ctx.manager.findByEmail(email));

      if (emailExists) {
        reply.status(400).send({ message: "Email already exists" });
      }

      const manager = await request.ctx.manager.insert({
        managerName,
        email,
        phone,
      });

      await request.ctx.restaurants.insert({
        restaurantName,
        managerId: manager.id,
      });

      reply.status(204).send();
    }
  );
}
