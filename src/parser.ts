import * as fs from "fs";
import { add_indents } from "indent-adder";
import * as PEG from "pegjs";
import * as AST from "./ast";

export class Parser {
  private parser: PEG.Parser;
  public constructor() {
    const grammar = fs.readFileSync("src/grammar/sisal.pegjs", "utf8");
    this.parser = PEG.generate(grammar);
  }
  public parse(program: string): AST.Definition[] {
    return this.parser.parse(add_indents(program, "{", "}", "#", "'\"", "([", ")]"));
  }
}
