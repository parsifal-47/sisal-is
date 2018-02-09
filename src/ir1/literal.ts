import { SingleValuePort } from "./ports/single"
import { Node } from "./node"
import * as Values from "./values";
import * as AST from "../ast";

export class Literal extends Node {

  constructor(defintion: AST.Literal) {
    super("Literal");

    if (!AST.isLiteral(defintion)) {
      throw new Error("Trying to construct literal from " + JSON.stringify(defintion));
    }
    let value: Values.ReadyValue;

    if (AST.isBooleanLiteral(defintion)) {
      value = new Values.Boolean(defintion.value);
    } else if (AST.isIntegerLiteral(defintion)) {
      value = new Values.Integer(defintion.value);
    } else if (AST.isFloatLiteral(defintion)) {
      value = new Values.Float(defintion.value);
    } else if (AST.isStringLiteral(defintion)) {
      value = new Values.String(defintion.value);
    } else {
      throw new Error("Unexpected literal type " + JSON.stringify(defintion));
    }

    this.outPorts.push(new SingleValuePort((dataType: ReadyType) => value));
  }
}
