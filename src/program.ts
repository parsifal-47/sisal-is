import * as fs from "fs";
import * as AST from "./ast";
import { nodeFromExpression } from "./ir1/create";
import { Parser } from "./parser";
import { Port } from "./ir1/ports/port";
import { FlatScope } from "./ir1/scopes/flat";
import { Scope } from "./ir1/scopes/scope";
import * as Types from "./ir1/types";
import * as Values from "./ir1/values";

export class Program {
  public outputs: Port[];

  public constructor(text: string, parser: Parser, stdLib: Scope) {
    const scope = new FlatScope(stdLib);
    scope.addFromAST(parser.parse(text));

    const value = scope.resolve("main", new Types.Some(), 0);

    if (value instanceof Values.ErrorValue) {
      throw new Error("No main function defined\n");
    }
    const main = value as Values.Function;
    const type = main.type as Types.Function;

    if (type.params.length > 0) {
      throw new Error("Main function arguments are not supported\n");
    }

    this.outputs = [];

    const nodes = main.bodyFactory(scope);
    for (const node of nodes) {
      node.requestPorts(1);
      for (const port of node.outPorts) {
        this.outputs.push(port);
      }
    }
  }
}
