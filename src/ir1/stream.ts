import { Node } from "./node"
import { Scope } from "./scope"
import { StreamPort } from "./ports/stream"
import { nodeFromExpression } from "./create";
import * as AST from "../ast/composite";

export class StreamValue extends Node {
  private nodes: Node[];

  constructor(defintion: AST.StreamValue, scope: Scope) {
    super("StreamValue");
    this.nodes = [];
    this.nodes.push(nodeFromExpression(defintion.lowerBound, scope));

    if (defintion.upperBound) {
      this.nodes.push(nodeFromExpression(defintion.upperBound, scope));
    }

    for (let node in nodes) {
      if (node.outPorts.length !== 1) {
        throw new Error("Array literal part should produce exactly one output");
      }
      this.inPorts.push(node.outPorts[0]);
    }

    this.outPorts = [new StreamPort(this.fetchData)];
  }

  private fetchData(dataType: Types.ReadyType, offset: number): Values.ReadyValue {
    if (!checkType(new Types.Stream(new Some()), dataType)) {
      return new ErrorValue("Incompartible type, not stream");
    }
    if (!this.leftBound) {
      this.leftBound = this.inPorts[0].getData(new Types.Integer());
      if (this.inPorts.length > 1) {
        this.rightBound = this.inPorts[1].getData(new Types.Integer());
      }
    }
    if (this.rightBound && (this.leftBound.value + offset >= this.rightBound.value)) {
      return new Values.StreamEnd();
    }
    return new Values.StreamElement(new Values.Integer(this.leftBound.value + offset));
  }
}
