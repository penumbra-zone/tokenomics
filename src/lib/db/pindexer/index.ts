import { Kysely } from "kysely";

import { Env, env } from "@/lib/env/server";
import { MockPindexerConnection } from "./mock/mock-pindexer-connection";
import { Pindexer as PostgresPindexerConnection } from "./pindexer";
import { DB } from "./schema";
import { AbstractPindexerConnection } from "./types";

// Pindexer Database Module
// Main exports for database operations and configuration

// Core database client and types
export { dbClient } from "./client";
export * from "./schema";
export type * from "./types";

// Database mappings and configuration
export * from "./database-mappings";

// Service modules
export * from "./services/block_service";
export * from "./services/burn_service";
export * from "./services/dex_service";
export * from "./services/market_service";
export * from "./services/supply_service";

let PindexerConnection: new (db?: Kysely<DB>) => AbstractPindexerConnection =
  PostgresPindexerConnection;
if (env.NODE_ENV === Env.Test) {
  PindexerConnection = MockPindexerConnection;
}

let pindexerInstance = new PindexerConnection();

export { pindexerInstance as pindexer };
