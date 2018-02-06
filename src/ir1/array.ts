import { Node } from "./node"
import * as AST from "../ast/composite";
import { Subscriber } from "../streams/subscriber"
import { Publisher } from "../streams/publisher"
import { SequencePublisher } from "../streams/sequence";
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
    this.outPorts = [new SequencePublisher(this.nodes)];
  }
}
