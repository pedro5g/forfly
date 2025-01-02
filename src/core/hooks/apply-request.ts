import type { FastifyInstance } from "fastify";
import { Context } from "../../models/context";
import type { PayloadType } from "../../types/fastify-request";

export async function applyRequest(app: FastifyInstance) {
  app.addHook("onRequest", async (request, reply) => {
    request.ctx = new Context();
    request.signUser = async (payload, redirect) => {
      const token = await reply.jwtSign(payload);
      reply
        .setCookie("auth", token, {
          // set a cookie in http request
          secure: true,
          sameSite: true,
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        })
        .redirect(redirect, 301); // redirect to dashboard page
    };

    request.signOut = () => {
      reply.clearCookie("auth");
    };

    request.getCurrentUser = async () => {
      const payload = await request.jwtVerify<PayloadType>();

      if (!payload) {
        throw new Error();
      }

      return {
        userId: payload.sub,
        restaurantId: payload.restauranteId,
      };
    };
  });
}
