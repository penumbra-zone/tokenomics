import { Metadata } from "@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb";
import { Kysely } from "kysely";

import { formatAssetAmount } from "@/lib/registry/utils";

import { DB } from "../schema";

export interface AssetMetadataMap {
  um: Metadata;
  usdc: Metadata;
}

export class BaseService {
  protected db!: Kysely<DB>;
  protected metadataMap: AssetMetadataMap | null = null;

  constructor(dbInstance: Kysely<DB>, metadataMap: AssetMetadataMap) {
    this.db = dbInstance;
    this.metadataMap = metadataMap;
  }

  protected formatAmount(
    amount: string | bigint | number | null | undefined,
    asset: keyof AssetMetadataMap
  ): string {
    if (!this.metadataMap) {
      throw new Error("Metadata not initialized");
    }

    const value = !amount ? BigInt(0) : BigInt(Math.trunc(Number(amount)));
    return formatAssetAmount(value, this.metadataMap[asset]);
  }
}
