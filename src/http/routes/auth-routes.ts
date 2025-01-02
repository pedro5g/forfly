import { z } from "zod";
import type { FastifyTypeInstance } from "../../types/fastify";
import { randomUUID } from "node:crypto";
import { env } from "../../env";
import { mail } from "../../lib/nodemiler";
import { logger } from "../../core/logger";
import dayjs from "dayjs";

export async function authRoutes(app: FastifyTypeInstance) {
  app.post(
    "/authenticate",
    {
      schema: {
        tags: ["Auth"],
        description: "authenticate",
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          200: z.null().describe("email sended"),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      const userFound = await request.ctx.manager.findByEmail(email);

      if (!userFound) {
        throw new Error("User not found");
      }

      const authLinkCode = randomUUID();

      await request.ctx.authLinks.insert({
        code: authLinkCode,
        userId: userFound.id,
      });

      const authLink = new URL("/auth-links/authenticate", env.API_BASE_URL);

      authLink.searchParams.set("code", authLinkCode);
      authLink.searchParams.set("redirect", env.AUTH_REDIRECT_URL);

      if (env.NODE_ENV === "production") {
        await mail.sendMail({
          from: {
            name: "Pizza Shop",
            address: "hi@pizzashop.com",
          },
          to: email,
          subject: "Authenticate to Pizza Shop",
          text: `Use the following link to authenticate on Pizza Shop: ${authLink.toString()}`,
        });
      }

      if (env.NODE_ENV === "dev") {
        logger.info(`code ${authLinkCode}`);
        logger.info(`code ${env.AUTH_REDIRECT_URL}`);
        logger.info(`auth link ${authLink.toString()}`);
      }
      reply.status(200).send();
    }
  );

  app.get(
    "/auth-links/authenticate",
    {
      schema: {
        tags: ["Auth"],
        description: "Link confirmation route",
        querystring: z.object({
          code: z.string(),
          redirect: z.string(),
        }),
        response: {
          300: z.null(),
        },
      },
    },
    async (request) => {
      const { code, redirect } = request.query;
      const authLinkFromCode = await request.ctx.authLinks.findByCode(code);

      if (!authLinkFromCode) {
        throw new Error("Auth link not found");
      }

      const daysSinceAuthLinkWasCreated = dayjs().diff(
        authLinkFromCode.createdAt,
        "days"
      );

      if (daysSinceAuthLinkWasCreated > 7) {
        throw new Error("Auth link expired, please generate a new one.");
      }

      const managedRestaurante =
        await request.ctx.restaurants.getRestaurantByManagerId(
          authLinkFromCode.userId
        );

      if (!managedRestaurante) {
        throw new Error("Restaurant not found");
      }

      await request.signUser(
        {
          sub: authLinkFromCode.userId,
          restauranteId: managedRestaurante.id,
        },
        redirect
      );
      await request.ctx.authLinks.delete(code);
    }
  );

  app.post(
    "/sign-out",
    {
      schema: {
        tags: ["Auth"],
        description: "Sign Out",
        response: {
          200: z.null().describe("user sign out successfully"),
        },
      },
    },
    async (request, reply) => {
      request.signOut();
      reply.status(200).send();
    }
  );
}
