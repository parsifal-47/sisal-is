import * as fs from "fs";
import { add_indents } from "indent-adder";
import * as PEG from "pegjs";
import * as AST from "./ast";
import { Port } from "./ir1/ports/port";
import { FlatScope } from "./ir1/scopes/flat";
import { Scope } from "./ir1/scopes/scope";
import * as Types from "./ir1/types";
import * as Values from "./ir1/values";
import { StdLibBuilder } from "./stdlib";

export class Program {
  public outputs: Port[];
  private parser: PEG.Parser;
  private stdLib: Scope;

  public constructor(text: string) {
    const grammar = fs.readFileSync("src/grammar/sisal.pegjs", "utf8");
    this.parser = PEG.generate(grammar, { trackLineAndColumn: true } as PEG.ParserBuildOptions);
    this.stdLib = StdLibBuilder.build();

    const scope = new FlatScope(this.stdLib);
    scope.addFromAST(this.parse(text));

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
    for (const node of main.nodes) {
      for (const port of node.outPorts) {
        this.outputs.push(port);
      }
    }
  }

  private parse(program: string): AST.Definition[] {
    return this.parser.parse(add_indents(program, "{", "}", "#", "'\"", "([", ")]"));
  }
}
