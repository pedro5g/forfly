import { Pool } from "pg";
import { env } from "../env";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schemas";

const connection = new Pool({ connectionString: env.DATABASE_URL });

export const db = drizzle(connection, {
  schema,
  logger: env.NODE_ENV !== "production" ? true : false,
});
