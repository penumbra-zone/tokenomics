import { Kysely } from "kysely";

import { Env } from "@/lib/env/types";
import { getUmAssetMetadata, getUSDCAssetMetadata } from "@/lib/registry/utils";
import { MockPindexerConnection } from "./mock/mock-pindexer-connection";
import { Pindexer as PostgresPindexerConnection } from "./pindexer";
import { DB } from "./schema";
import { AssetMetadataMap } from "./services/base_service";
import { AbstractPindexerConnection } from "./types";
import { getEnv } from "@/lib/env/server";

// Pindexer Database Module
// Main exports for database operations and configuration

// Core database client and types
export { getDbClient } from "./client";
export * from "./schema";
export type * from "./types";

// Database mappings and configuration
export * from "./database-mappings";

// Service modules
export * from "./services/block_service";
export * from "./services/burn_service";
export * from "./services/market_service";
export * from "./services/supply_service";

let PindexerConnection: new (
  metadataMap: AssetMetadataMap,
  db?: Kysely<DB>
) => AbstractPindexerConnection = PostgresPindexerConnection;
if (getEnv().NODE_ENV === Env.Test) {
  PindexerConnection = MockPindexerConnection;
}

const [umMetadata, usdcMetadata] = await Promise.all([
  getUmAssetMetadata(),
  getUSDCAssetMetadata(),
]);

let pindexerInstance = new PindexerConnection({ um: umMetadata!, usdc: usdcMetadata! });

export { pindexerInstance as pindexer };