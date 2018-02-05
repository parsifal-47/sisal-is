import * as peg from "pegjs";
import { add_indents } from "indent-adder";
import * as fs from "fs";
import { StdLibBuilder } from "./stdlib";
import { Scope } from "./scope";

export class Interpreter {
  private parser: peg.Parser;
  public constructor() {
    // TODO: { trackLineAndColumn: true} adds line and column vars
    const grammar = fs.readFileSync('src/grammar/sisal.pegjs', 'utf8');
    this.parser = peg.generate(grammar);
  }
  public run(program: string): void {
    const stdLib = StdLibBuilder.build();
    const scope = new Scope(stdLib, this.parse(program));
    // subscribe to outports
    // wait finish
  }
  private parse(program: string): peg.OutputFormatBare {
    return this.parser.parse(add_indents(program, "{", "}", "#", "'\"", "([", ")]"));
  }
}
