import * as PEG from "pegjs";
import * as Ir1 from "./ir1";
import * as AST from "./ast";
import { add_indents } from "indent-adder";
import * as fs from "fs";
import { StdLibBuilder } from "./stdlib";

export class Interpreter {
  private parser: PEG.Parser;
  public constructor() {
    const grammar = fs.readFileSync('src/grammar/sisal.PEGjs', 'utf8');
    this.parser = PEG.generate(grammar, { trackLineAndColumn: true } as PEG.ParserBuildOptions);
  }
  public run(program: string): void {
    const stdLib = StdLibBuilder.build();
    const scope = new Ir1.ProgramScope(stdLib, this.parse(program));
    // subscribe to outports
    // wait finish
  }
  private parse(program: string): AST.Definition[] {
    return this.parser.parse(add_indents(program, "{", "}", "#", "'\"", "([", ")]"));
  }
}
