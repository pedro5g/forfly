import { env } from "../env";
import * as schema from "./schemas";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;
const connection = new Pool({ connectionString: env.DATABASE_URL });

export const db = drizzle({
  schema,
  client: connection,
  logger: env.NODE_ENV === "dev" ? true : false,
});
