import * as AST from "../ast";
import * as ASTTypes from "../ast/types";
import { Node } from "./node";
import { SingleValuePort } from "./ports/single";
import * as Types from "./types";
import * as Values from "./values";

export class LiteralType extends Node {

  constructor(defintion: ASTTypes.PrimitiveType) {
    super("LiteralType");

    let value: Values.ReadyValue;

    if (ASTTypes.isBooleanType(defintion)) {
      value = new Values.Type(new Types.Boolean());
    } else if (ASTTypes.isIntegerType(defintion)) {
      value = new Values.Type(new Types.Integer());
    } else if (ASTTypes.isFloatType(defintion)) {
      value = new Values.Type(new Types.Float());
    } else if (ASTTypes.isStringType(defintion)) {
      value = new Values.Type(new Types.String());
    } else {
      throw new Error("Unexpected literal type type " + JSON.stringify(defintion));
    }

    this.outPorts.push(new SingleValuePort((dataType: Types.ReadyType) => value));
  }
}
