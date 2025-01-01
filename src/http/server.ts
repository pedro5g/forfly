import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { env } from "../env";
import { logger } from "../core/logger";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastifyJwt } from "@fastify/jwt";
import { fastifyCookie } from "@fastify/cookie";
import { requestLogger } from "../core/hooks/request-logger";
import { applyRequest } from "../core/hooks/apply-request";
import { restaurantRoutes } from "./routes/restaurant-routes";
import { authRoutes } from "./routes/auth-routes";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });
app.register(fastifyCookie);
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "access_token",
    signed: false,
  },
  sign: {
    expiresIn: "7d",
  },
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Pizza shop api",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

requestLogger(app);
applyRequest(app);
app.register(restaurantRoutes);
app.register(authRoutes);
app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.get("/", async (_req, res) => {
  res.send({ message: "server is on :)" });
});

app.listen({ port: env.PORT, host: env.HOST }).then(() => {
  logger.info(`Server is running on port ${env.PORT} 🚀`);
  logger.info(`Docs http://localhost:${env.PORT}/docs`);
});
