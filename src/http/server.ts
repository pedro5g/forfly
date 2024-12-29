import fastify from "fastify";
import { env } from "../env";
import { logger } from "../core/logger";

const app = fastify();
app.get("/", async (_req, res) => {
  res.send({ message: "server is on :)" });
});

app.listen({ port: env.PORT, host: env.HOST }).then(() => {
  logger.info(`Server is running on port ${env.PORT} 🚀`);
});
