import * as AST from "../../ast";
import * as ASTTypes from "../../ast/types";
import { SingleValuePort } from "../ports/single";
import * as Types from "../types";
import * as Values from "../values";
import { Node } from "./node";

export class ReadyLiteral extends Node {

  constructor(value: Values.ReadyValue) {
    super("Literal");
    this.outPorts.push(new SingleValuePort((dataType: Types.ReadyType) => value));
  }
}
