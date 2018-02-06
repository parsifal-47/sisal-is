import { Node } from "./node"
import * as AST from "../ast/composite";
import { RangePublisher } from "../streams/range";

export class StreamValue extends Node {
  private nodes: Node[];

  constructor(defintion: AST.StreamValue) {
    super("StreamValue");
    this.nodes = [];
    this.nodes.push(create(defintion.lowerBound));

    if (defintion.upperBound) {
      this.nodes.push(create(defintion.upperBound));
    }
    this.outPorts = [new RangePublisher(this.nodes)];
  }
}
