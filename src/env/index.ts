import { config } from "dotenv";
import { z } from "zod";
config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("0.0.0.0"),
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  AUTH_REDIRECT_URL: z.string(),
  API_BASE_URL: z.string(),
  EMAIL_ADDRESS: z.string(),
  EMAIL_PASSWORD: z.string(),
  EMAIL_SERVICE: z.string(),
  EMAIL_HOST: z.string(),
});

const _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("Invalid environment variables", _env.error.flatten());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
