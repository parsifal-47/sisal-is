import * as fs from "fs";
import { FlatScope } from "./ir1/scopes/flat";
import { Scope } from "./ir1/scopes/scope";
import { Parser } from "./parser";
import { FunctionWrap } from "./stdlib/wrapper";
import { lastValueFactory } from "./stdlib/last";
import * as Types from "./ir1/types";

export function buildStdLib(parser: Parser): Scope {
  const scope = new FlatScope(undefined);
  const reductions = parser.parse(fs.readFileSync("src/stdlib/reductions.sis", "utf8"));
  scope.addFromAST(reductions);

  const lastValue = new FunctionWrap(scope, "last", ["stream"],
             new Types.Function([new Types.Stream(new Types.Some())], [new Types.Some()]),
             lastValueFactory("stream"));
  scope.inject("last", lastValue.outPorts[0]);
  return scope;
}
