import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import { getEnv } from "@/lib/env/server";
import type { DB } from "./schema";

let dbClient: Kysely<DB> | undefined;

export function getDbClient() {
  if (dbClient) return dbClient;

  const connectionString = getEnv().DATABASE_URL;

  const poolConfig = {
    connectionString,
    ssl: connectionString?.includes("localhost") ? false : { rejectUnauthorized: false },
  };

  let pool: Pool;

  if (process.env.NODE_ENV === "production") {
    pool = new Pool(poolConfig);
  } else {
    // Ensure the pool is not recreated in development with hot reloads
    if (!(global as any).pgPool) {
      (global as any).pgPool = new Pool(poolConfig);
    }
    pool = (global as any).pgPool;
  }

  const dialect = new PostgresDialect({
    pool,
  });

  dbClient = new Kysely<DB>({ dialect });
  return dbClient;
}
