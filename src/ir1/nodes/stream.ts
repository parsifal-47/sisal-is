import * as AST from "../../ast/composite";
import { nodeFromExpression } from "../create";
import { StreamPort } from "../ports/stream";
import { Scope } from "../scopes/scope";
import * as Types from "../types";
import * as Values from "../values";
import { Node } from "./node";

export class StreamValue extends Node {
  private nodes: Node[];
  private leftBound?: Values.Integer;
  private rightBound?: Values.Integer;

  constructor(defintion: AST.StreamValue, scope: Scope) {
    super("StreamValue", defintion);
    this.nodes = [];
    this.nodes.push(nodeFromExpression(defintion.lowerBound, scope));

    if (defintion.upperBound) {
      this.nodes.push(nodeFromExpression(defintion.upperBound, scope));
    }
    this.addInPorts(this.nodes);

    this.outPorts = [new StreamPort((type: Types.ReadyType, offset: number) => this.fetchData(type, offset))];
  }

  private fetchData(dataType: Types.ReadyType, offset: number): Values.ReadyValue {
    if (!Types.checkType(new Types.Stream(new Types.Some()), dataType)) {
      return new Values.ErrorValue("Incompartible type, not stream");
    }
    if (!this.leftBound) {
      this.leftBound = this.inPorts[0].getData(new Types.Integer()) as Values.Integer;
      if (this.inPorts.length > 1) {
        this.rightBound = this.inPorts[1].getData(new Types.Integer()) as Values.Integer;
      }
    }
    if (this.rightBound && (this.leftBound.value + offset > this.rightBound.value)) {
      return new Values.StreamEnd();
    }
    return new Values.StreamElement(new Values.Integer(this.leftBound.value + offset));
  }
}
