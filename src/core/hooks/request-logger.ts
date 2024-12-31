import type { FastifyInstance } from "fastify";
import { env } from "../../env";
import { logger } from "../logger";

export async function requestLogger(app: FastifyInstance) {
  app.addHook("onRequest", async (request) => {
    const { ip, method, url, headers } = request;
    const { restaurant_id, user_id } = headers as Record<string, string>;

    const id = new Date().getTime();

    let idsMsg = "";
    if (user_id) idsMsg += ` _ u=${user_id}`;
    if (restaurant_id) idsMsg += ` _ a=${restaurant_id}`;

    if (env.NODE_ENV === "dev" || process.env.DEBUG) {
      const msg = `[${ip}] {${method}} ${id} - Receiving ${url}`;
      logger.info(`${msg}${idsMsg}`);
    }

    request.headers["request-start-time"] = `${new Date().getTime()}`;
  });

  app.addHook("onResponse", async (request, reply) => {
    const started = Number(request.headers["request-start-time"] || 0);
    const took = new Date().getTime() - started;

    const { ip, method, url, headers } = request;
    const { account_id, user_id } = headers as Record<string, string>;

    let idsMsg = "";
    if (user_id) idsMsg += ` _ u=${user_id}`;
    if (account_id) idsMsg += ` _ a=${account_id}`;
    logger.info(
      `{req} [${ip}] ${method}` + `${url} : http=${reply.statusCode} ${took}ms`
    );
  });
}
