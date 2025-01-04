import { z } from "zod";
import type { FastifyTypeInstance } from "../../types/fastify";
import { authMiddleware } from "../../core/middleware/auth-middleware";
import { BadRequestError } from "../_errors/bad-request-error";
import { NotFoundError } from "../_errors/not-found-error";

export async function restaurantRoutes(app: FastifyTypeInstance) {
  app.post(
    "/restaurants",
    {
      schema: {
        description: "Register Restaurant",
        tags: ["Restaurant"],
        body: z.object({
          managerName: z.string().min(3),
          restaurantName: z.string().min(3),
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

  app.get(
    "/managed-restaurant",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Restaurant"],
        description: "Get restaurant infos",
        response: {
          200: z.object({
            id: z.string().uuid(),
            name: z.string(),
            createdAt: z.date(),
            updatedAt: z.date(),
            description: z.string().nullable(),
            managerId: z.string().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const restaurantId = await request.getManagerRestaurantId();

      const mangedRestaurant = await request.ctx.restaurants.getRestaurantById(
        restaurantId
      );

      if (!mangedRestaurant) {
        throw new NotFoundError("Restaurant not found");
      }

      reply.status(200).send(mangedRestaurant);
    }
  );

  app.put(
    "/profile",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Restaurant"],
        description: "Update restaurant profile data",
        body: z.object({
          name: z.string(),
          description: z.string().optional(),
        }),
        response: {
          204: z.null().describe("Restaurant profile updated successfully"),
        },
      },
    },
    async (request, reply) => {
      const restaurantId = await request.getManagerRestaurantId();
      const { name, description } = request.body;

      await request.ctx.restaurants.updateProfile({
        restaurantId,
        name,
        description,
      });

      reply.status(204).send();
    }
  );
}
