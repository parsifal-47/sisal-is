import { Node } from "./node"
import * as AST from "../ast/composite";
import { SingleValuePort } from "./ports/single"
import { nodeFromExpression } from "./create";
import { Scope } from "./scope"

export class ArrayValue extends Node {
  private nodes: Node[];

  constructor(defintion: AST.ArrayValue, scope: Scope) {
    super("Array");
    this.nodes = [];
    for (let expression in defintion.contents) {
      this.nodes.push(nodeFromExpression(expression, scope));
    }

    for (let node in nodes) {
      if (node.outPorts.length !== 1) {
        throw new Error("Array literal part should produce exactly one output");
      }
      this.inPorts.push(node.outPorts[0]);
    }

    this.outPorts = [new SingleValuePort(this.fetchData)];
  }

  public fetchData(type: ReadyType): ReadyValue {
    if (!checkType(new ArrayType(new Some()), type)) {
      return new ErrorValue("Incompartible type, not array");
    }

    let results: ReadyValue[] = [];
    let subType: ReadyType;

    if (type instanceof ArrayType) {
      subType = type.elementType;
    } else {
      subType = new Some();
    }

    for (let port in this.inPorts) {
      results.push(fetchComplete(port, subType));
    }

    return new Array(results);
  }
}
