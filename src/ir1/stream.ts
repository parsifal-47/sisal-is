import { Node } from "./node"
import { Scope } from "./scope"
import { nodeFromExpression } from "./create";
import * as AST from "../ast/composite";
import { RangePublisher } from "../streams/range";

export class StreamValue extends Node {
  private nodes: Node[];

  constructor(defintion: AST.StreamValue, scope: Scope) {
    super("StreamValue");
    this.nodes = [];
    this.nodes.push(nodeFromExpression(defintion.lowerBound, scope));

    if (defintion.upperBound) {
      this.nodes.push(nodeFromExpression(defintion.upperBound, scope));
    }
    this.outPorts = [new RangePublisher(this.nodes)];
  }
}
