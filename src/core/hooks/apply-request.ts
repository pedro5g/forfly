import type { FastifyInstance } from "fastify";
import { Context } from "../../models/context";
import type { PayloadType } from "../../types/fastify-request";
import { UnauthorizedError } from "../../http/_errors/unauthorized-error";
import { NotManagerError } from "../../http/_errors/not-manager-error";

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
        throw new UnauthorizedError();
      }

      return {
        userId: payload.sub,
        restaurantId: payload.restauranteId,
      };
    };

    request.getManagerRestaurantId = async () => {
      const { restaurantId } = await request.getCurrentUser();

      if (!restaurantId) {
        throw new NotManagerError();
      }
      return restaurantId;
    };
  });
}
