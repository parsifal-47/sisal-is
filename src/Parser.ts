import * as peg from "pegjs";
import { add_indents } from "indent-adder";
import * as fs from "fs";

export class SisalParser {
  private parser: peg.Parser;
  public constructor() {
    const grammar = fs.readFileSync('src/grammar/sisal.pegjs', 'utf8');
    this.parser = peg.generate(grammar);
  }
  public parse(program: string): peg.OutputFormatBare {
    return this.parser.parse(add_indents(program, "{", "}","#", "'\"", "([", ")]"));
  }
}
