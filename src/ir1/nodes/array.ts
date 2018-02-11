import * as AST from "../../ast/composite";
import { nodeFromExpression } from "../create";
import { SingleValuePort } from "../ports/single";
import { Scope } from "../scopes/scope";
import * as Types from "../types";
import { checkType } from "../types/check";
import * as Values from "../values";
import { Node } from "./node";

export class ArrayValue extends Node {
  private nodes: Node[];

  constructor(defintion: AST.ArrayValue, scope: Scope) {
    super("Array");
    this.nodes = [];
    for (const expression of defintion.contents) {
      this.nodes.push(nodeFromExpression(expression, scope));
    }

    this.addInPorts(this.nodes);

    this.outPorts = [new SingleValuePort(this.fetchData)];
  }

  public fetchData(type: Types.ReadyType): Values.ReadyValue {
    if (!checkType(new Types.Array(new Types.Some()), type)) {
      return new Values.ErrorValue("Incompartible type, not array");
    }

    const results: Values.ReadyValue[] = [];
    let subType: Types.ReadyType;

    if (type instanceof Types.Array) {
      subType = type.element;
    } else {
      subType = new Types.Some();
    }

    for (const port of this.inPorts) {
      results.push(Values.fetchComplete(port, subType));
    }

    return new Values.Array(results);
  }
}
