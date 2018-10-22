import * as AST from "../../ast";
import { nodeFromExpression } from "../create";
import { StreamPort } from "../ports/stream";
import { Scope } from "../scopes/scope";
import * as Types from "../types";
import * as Values from "../values";
import { Node } from "./node";

export class UnaryExpression extends Node {
  private nodes: Node[];
  private operator: string;

  constructor(definition: AST.UnaryExpression, scope: Scope) {
    super("Unary", definition);
    this.operator = definition.operator;

    this.nodes = [];
    this.nodes.push(nodeFromExpression(definition.right, scope));

    this.addInPorts(this.nodes);

    this.outPorts.push(new StreamPort((type: Types.ReadyType, offset: number) => this.fetchData(type, offset)));
  }

  private fetchData(dataType: Types.ReadyType, offset: number): Values.ReadyValue {
    const right = this.inPorts[0].getData(dataType, offset);

    return this.processOperation(right);
  }

  private processOperation(value: Values.ReadyValue): Values.ReadyValue {
    if (value instanceof Values.Integer) {
      if (this.operator === "-") {
        return new Values.Integer(-value.value);
      }
      if (this.operator === "+") {
        return value;
      }
    }

    if (value instanceof Values.Float) {
      if (this.operator === "-") {
        return new Values.Float(-value.value);
      }
      if (this.operator === "+") {
        return value;
      }
    }

    if (value instanceof Values.Boolean) {
      if (this.operator === "!") {
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
