import { z } from "zod";
import { authMiddleware } from "../../core/middleware/auth-middleware";
import type { FastifyTypeInstance } from "../../types/fastify";

export async function customerRoutes(app: FastifyTypeInstance) {
  app.post(
    "/customers",
    {
      onRequest: [authMiddleware],
      schema: {
        tags: ["Customer"],
        description: "Register new customer",
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          phone: z.string().regex(/^\(\d{2}\) 9\d{4}-\d{4}$/),
        }),
        response: {
          200: z.null().describe("Customer was registered"),
          400: z.object({
            message: z.string().default("Email already exists"),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, phone } = request.body;

      const emailExists = !!(await request.ctx.customer.findByEmail(email));

      if (emailExists) {
        reply.status(400).send({ message: "Email already exists" });
      }

      await request.ctx.customer.registerCustomer({ name, email, phone });

      reply.status(200).send();
    }
  );
}
