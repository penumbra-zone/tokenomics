import { MockPindexerConnection } from "./mock/mock-pindexer-connection";
import { PindexerConnection as PostgresPindexerConnection } from "./pindexer-connection";
import { AbstractPindexerConnection } from "./types";

export * from "./types";

let PindexerConnection: new (connectionString?: string) => AbstractPindexerConnection =
  PostgresPindexerConnection;
if (process.env.NODE_ENV === "test") {
  PindexerConnection = MockPindexerConnection;
}

export { PindexerConnection };
