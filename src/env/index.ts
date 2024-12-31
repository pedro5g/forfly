import { config } from "dotenv";
import { z } from "zod";
config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("0.0.0.0"),
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});

const _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("Invalid environment variables", _env.error.flatten());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
