import fastify from "fastify";
import { env } from "../env";

const app = fastify();
app.get("/", async (_req, res) => {
  res.send({ message: "server is on :)" });
});

app.listen({ port: env.PORT, host: env.HOST }).then(() => {
  console.log(`Server is running on port ${env.PORT} 🚀`);
});
