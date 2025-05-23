import { Kysely } from "kysely";

import { MockPindexerConnection } from "./mock/mock-pindexer-connection";
import { Pindexer as PostgresPindexerConnection } from "./pindexer";
import { DB } from "./schema";
import { AbstractPindexerConnection } from "./types";
import { Env, env } from "@/lib/env";

export * from "./types";

let PindexerConnection: new (db?: Kysely<DB>) => AbstractPindexerConnection =
  PostgresPindexerConnection;
if (env.NODE_ENV === Env.Test) {
  PindexerConnection = MockPindexerConnection;
}

let pindexer = new PindexerConnection();

export { pindexer };
