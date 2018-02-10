import { Node } from "./node"
import * as AST from "../ast/composite";
import { SingleValuePort } from "./ports/single"
import { nodeFromExpression } from "./create";
import { Scope } from "./scope"
import * as Types from "./types";
import * as Values from "./values";
import { checkType } from "./types/check"

export class ArrayValue extends Node {
  private nodes: Node[];

  constructor(defintion: AST.ArrayValue, scope: Scope) {
    super("Array");
    this.nodes = [];
    for (let expression of defintion.contents) {
      this.nodes.push(nodeFromExpression(expression, scope));
    }

    for (let node of this.nodes) {
      if (node.outPorts.length !== 1) {
        throw new Error("Array literal part should produce exactly one output");
      }
      this.inPorts.push(node.outPorts[0]);
    }

    this.outPorts = [new SingleValuePort(this.fetchData)];
  }

  public fetchData(type: Types.ReadyType): Values.ReadyValue {
    if (!checkType(new Types.Array(new Types.Some()), type)) {
      return new Values.ErrorValue("Incompartible type, not array");
    }

    let results: Values.ReadyValue[] = [];
    let subType: Types.ReadyType;

    if (type instanceof Types.Array) {
      subType = type.element;
    } else {
      subType = new Types.Some();
    }

    for (let port of this.inPorts) {
      results.push(Values.fetchComplete(port, subType));
    }

    return new Values.Array(results);
  }
}
