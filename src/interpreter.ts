import * as fs from "fs";
import { add_indents } from "indent-adder";
import * as PEG from "pegjs";
import * as AST from "./ast";
import { createFromAST } from "./ir1/scope";
import { StdLibBuilder } from "./stdlib";

export class Interpreter {
  private parser: PEG.Parser;
  public constructor() {
    const grammar = fs.readFileSync("src/grammar/sisal.PEGjs", "utf8");
    this.parser = PEG.generate(grammar, { trackLineAndColumn: true } as PEG.ParserBuildOptions);
  }
  public run(program: string): void {
    const stdLib = StdLibBuilder.build();
    const scope = createFromAST(stdLib, this.parse(program));
    // subscribe to outports
    // wait finish
  }
  private parse(program: string): AST.Definition[] {
    return this.parser.parse(add_indents(program, "{", "}", "#", "'\"", "([", ")]"));
  }
}
