import * as fs from "fs";
import { add_indents } from "indent-adder";
import * as PEG from "pegjs";
import * as AST from "./ast";
import { FlatScope } from "./ir1/scopes/flat";
import * as Types from "./ir1/types";
import * as Values from "./ir1/values";
import { printPortData } from "./print";
import { StdLibBuilder } from "./stdlib";

export class Interpreter {
  private parser: PEG.Parser;
  public constructor() {
    const grammar = fs.readFileSync("src/grammar/sisal.pegjs", "utf8");
    this.parser = PEG.generate(grammar, { trackLineAndColumn: true } as PEG.ParserBuildOptions);
  }
  public run(program: string): void {
    const stdLib = StdLibBuilder.build();
    const scope = new FlatScope(stdLib);
    scope.addFromAST(this.parse(program));

    const value = scope.resolve("main", new Types.Some(), 0);

    if (value instanceof Values.ErrorValue) {
      process.stdout.write("No main function defined\n");
      return;
    }
    const main = value as Values.Function;
    const type = main.type as Types.Function;

    if (type.params.length > 0) {
      process.stdout.write("Main function arguments are not supported\n");
      return;
    }

    let outNumber = 0;
    for (let node of main.nodes) {
      for (let port of node.outPorts) {
        process.stdout.write("Output #" + (outNumber++) + "\n");
        printPortData(port);
      }
    }
  }
  private parse(program: string): AST.Definition[] {
    return this.parser.parse(add_indents(program, "{", "}", "#", "'\"", "([", ")]"));
  }
}
