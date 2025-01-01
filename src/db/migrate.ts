import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { env } from "../env";
import pg from "pg";
import { logger } from "../core/logger";

const { Pool } = pg;
const connection = new Pool({ connectionString: env.DATABASE_URL });
const db = drizzle(connection);
await migrate(db, { migrationsFolder: "drizzle" });

logger.info("Migrations applied successfully !");

await connection.end();
process.exit();
