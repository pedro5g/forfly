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
import fastifyCookie from "@fastify/cookie";
import { requestLogger } from "../core/hooks/request-logger";
import { applyRequest } from "../core/hooks/apply-request";
import { restaurantRoutes } from "./routes/restaurant-routes";
import { authRoutes } from "./routes/auth-routes";
import { userRoutes } from "./routes/user-routes";
import { orderRoutes } from "./routes/order-routes";
import { productRoutes } from "./routes/product-routes";
import { ZodError } from "zod";

const app = fastify();

app.register(fastifyCors, {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
  credentials: true,
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCookie);
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "auth",
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
app.register(userRoutes);
app.register(orderRoutes);
app.register(productRoutes);

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.get("/", async (_req, res) => {
  res.send({ message: "server is on :)" });
});

app.setErrorHandler(async (error, _request, reply) => {
  if (error instanceof ZodError) {
    reply
      .status(400)
      .send({ message: `Validate error: ${error.formErrors.fieldErrors}` });
  }

  switch (error.constructor.name) {
    case "UnauthorizedError":
      return reply.status(401).send({ message: "UNAUTHORIZED" });
    case "BadRequestError":
      return reply.status(400).send({ message: error.message });
    case "NotFoundError":
      return reply.status(404).send({ message: error.message });
    default:
      logger.error(error);
      reply.status(500).send({ message: "Internal server error" });
  }
});

app.listen({ port: env.PORT, host: env.HOST }).then(() => {
  logger.info(`Server is running on port ${env.PORT} 🚀`);
  logger.info(`Docs http://localhost:${env.PORT}/docs`);
});
