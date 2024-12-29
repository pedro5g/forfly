import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { env } from "../env";
import { logger } from "../core/logger";

(async () => {
  const connection = new Pool({ connectionString: env.DATABASE_URL });
  const db = drizzle(connection);
  await migrate(db, { migrationsFolder: "drizzle" });

  logger.info("Migrations applied successfully !");

  await connection.end();
  process.exit();
})();
