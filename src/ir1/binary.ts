import { StreamPort } from "./ports/stream"
import { Node } from "./node"
import * as Value from "./value";
import * as AST from "../ast/literal";

export class BinaryExpression extends Node {
  private nodes: Node[];
  private operator: string;

  constructor(definition: AST.BinaryExpression, scope: Scope) {
    super("Binary");
    this.operator = definition.operator;

    this.nodes = [];
    this.nodes.push(nodeFromExpression(definition.left, scope));
    this.nodes.push(nodeFromExpression(definition.right, scope));

    for (let node in nodes) {
      if (node.outPorts.length !== 1) {
        throw new Error("Binary part should produce exactly one output");
      }
      this.inPorts.push(node.outPorts[0]);
    }

    this.outPorts.push(new StreamPort(this.fetchData));
  }
  private fetchData(dataType: Types.ReadyType, offset: number): Values.ReadyValue {

  }
}
