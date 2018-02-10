import { StreamPort } from "./ports/stream"
import { Node } from "./node"
import * as Values from "./values";
import * as Types from "./types";
import * as AST from "../ast";
import { nodeFromExpression } from "./create";
import { Scope } from "./scope";

export class UnaryExpression extends Node {
  private nodes: Node[];
  private operator: string;

  constructor(definition: AST.UnaryExpression, scope: Scope) {
    super("Unary");
    this.operator = definition.operator;

    this.nodes = [];
    this.nodes.push(nodeFromExpression(definition.right, scope));

    if (this.nodes[0].outPorts.length !== 1) {
      throw new Error("Binary operand should produce exactly one output");
    }
    this.inPorts.push(this.nodes[0].outPorts[0]);

    this.outPorts.push(new StreamPort(this.fetchData));
  }

  private fetchData(dataType: Types.ReadyType, offset: number): Values.ReadyValue {
    const right = this.inPorts[0].getData(dataType, offset);

    return this.processOperation(right);
  }

  private processOperation(value: Values.ReadyValue): Values.ReadyValue {
    if (value instanceof Values.Integer) {
      if (this.operator == "-") {
        return new Values.Integer(-value.value);
      }
      if (this.operator == "+") {
        return value;
      }
    }

    if (value instanceof Values.Float) {
      if (this.operator == "-") {
        return new Values.Float(-value.value);
      }
      if (this.operator == "+") {
        return value;
      }
    }

    if (value instanceof Values.Boolean) {
      if (this.operator == "!") {
        return new Values.Boolean(!value.value);
      }
    }

    if (value instanceof Values.StreamEnd) {
      return value;
    }

    if (value instanceof Values.StreamElement) {
      return new Values.StreamElement(this.processOperation(value.value));
    }

    return new Values.ErrorValue("Unsupported types " + value.type.name);
  }
}
