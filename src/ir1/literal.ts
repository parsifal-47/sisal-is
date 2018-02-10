import { SingleValuePort } from "./ports/single"
import { Node } from "./node"
import * as Values from "./values";
import * as Types from "./types";
import * as AST from "../ast";
import * as ASTTypes from "../ast/types";

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

export class LiteralType extends Node {

  constructor(defintion: AST.PrimitiveType) {
    super("TypeLiteral");

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

    this.outPorts.push(new SingleValuePort((dataType: ReadyType) => value));
  }
}
