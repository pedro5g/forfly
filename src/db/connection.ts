import { Pool } from "pg";
import { env } from "../env";

import * as schema from "./schemas";
import { drizzle } from "drizzle-orm/node-postgres";

const connection = new Pool({ connectionString: env.DATABASE_URL });

export const db = drizzle(connection, {
  schema,
  logger: env.NODE_ENV === "dev" ? true : false,
});
