import { Kysely } from "kysely";

import { MockPindexerConnection } from "./mock/mock-pindexer-connection";
import { Pindexer as PostgresPindexerConnection } from "./pindexer";
import { DB } from "./schema";
import { AbstractPindexerConnection } from "./types";

export * from "./types";

let PindexerConnection: new (db?: Kysely<DB>) => AbstractPindexerConnection =
  PostgresPindexerConnection;
if (process.env.NODE_ENV === "test") {
  PindexerConnection = MockPindexerConnection;
}

let pindexer = new PindexerConnection();

export { pindexer };
