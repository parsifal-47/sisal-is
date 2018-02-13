import * as AST from "../../ast";
import { nodeFromExpression } from "../create";
import { StreamPort } from "../ports/stream";
import { Scope } from "../scopes/scope";
import * as Types from "../types";
import * as Values from "../values";
import { Node } from "./node";

export class BinaryExpression extends Node {
  private nodes: Node[];
  private operator: string;

  constructor(definition: AST.BinaryExpression, scope: Scope) {
    super("Binary");
    this.operator = definition.operator;

    this.nodes = [];
    this.nodes.push(nodeFromExpression(definition.left, scope));
    this.nodes.push(nodeFromExpression(definition.right, scope));
    this.addInPorts(this.nodes);

    this.outPorts.push(new StreamPort((type: Types.ReadyType, offset: number) => this.fetchData(type, offset)));
  }

  private fetchData(dataType: Types.ReadyType, offset: number): Values.ReadyValue {
    const left: Values.ReadyValue = this.inPorts[0].getData(dataType, offset);
    const right: Values.ReadyValue = this.inPorts[1].getData(dataType, offset);

    if (!Types.checkType(left.type, right.type)) {
      return new Values.ErrorValue("Types should be equal for binary operation " +
                        JSON.stringify(left.type) + " " + JSON.stringify(right.type));
    }

    return this.processPair(left, right);
  }

  private processPair(left: Values.ReadyValue, right: Values.ReadyValue): Values.ReadyValue {
    if (left.type instanceof Types.Integer) {
      return this.processIntPair(left as Values.Integer, right as Values.Integer);
    }

    if (left.type instanceof Types.Float) {
      return this.processFloatPair(left as Values.Float, right as Values.Float);
    }

    if (left.type instanceof Types.Boolean) {
      return this.processBooelanPair(left as Values.Boolean, right as Values.Boolean);
    }

    if (left instanceof Values.StreamEnd) {
      return left;
    }

    if ((left instanceof Values.StreamElement) &&
        (right instanceof Values.StreamElement)) {
      return new Values.StreamElement(this.processPair(left.value, right.value));
    }

    return new Values.ErrorValue("Unsupported types " + left.type.name);
  }

  private processBooelanPair(left: Values.Boolean, right: Values.Boolean): Values.ReadyValue {
    if (this.operator === "|") {
      return new Values.Boolean(left.value || right.value);
    }
    if (this.operator === "&") {
      return new Values.Boolean(left.value && right.value);
    }
    if (this.operator === "||") {
      return new Values.Boolean(left.value || right.value);
    }
    return new Values.ErrorValue("Unknown operation " + this.operator);
  }

  private processIntPair(left: Values.Integer, right: Values.Integer): Values.ReadyValue {
    if (this.operator === "+") {
      return new Values.Integer(left.value + right.value);
    }
    if (this.operator === "-") {
      return new Values.Integer(left.value - right.value);
    }
    if (this.operator === "*") {
      return new Values.Integer(left.value * right.value);
    }
    if (this.operator === "/") {
      return new Values.Integer(left.value / right.value);
    }
    if (this.operator === "%") {
      return new Values.Integer(left.value % right.value);
    }
    if (this.operator === "<") {
      return new Values.Boolean(left.value < right.value);
    }
    if (this.operator === ">") {
      return new Values.Boolean(left.value > right.value);
    }
    if (this.operator === "<=") {
      return new Values.Boolean(left.value <= right.value);
    }
    if (this.operator === ">=") {
      return new Values.Boolean(left.value >= right.value);
    }
    if (this.operator === "=") {
      return new Values.Boolean(left.value === right.value);
    }
    if (this.operator === "/=") {
      return new Values.Boolean(left.value !== right.value);
    }
    return new Values.ErrorValue("Unknown operation " + this.operator);
  }

  private processFloatPair(left: Values.Float, right: Values.Float): Values.ReadyValue {
    if (this.operator === "+") {
      return new Values.Float(left.value + right.value);
    }
    if (this.operator === "-") {
      return new Values.Float(left.value - right.value);
    }
    if (this.operator === "*") {
      return new Values.Float(left.value * right.value);
    }
    if (this.operator === "/") {
      return new Values.Float(left.value / right.value);
    }
    if (this.operator === "<") {
      return new Values.Boolean(left.value < right.value);
    }
    if (this.operator === ">") {
      return new Values.Boolean(left.value > right.value);
    }
    if (this.operator === "<=") {
      return new Values.Boolean(left.value <= right.value);
    }
    if (this.operator === ">=") {
      return new Values.Boolean(left.value >= right.value);
    }
    if (this.operator === "=") {
      return new Values.Boolean(left.value === right.value);
    }
    if (this.operator === "/=") {
      return new Values.Boolean(left.value !== right.value);
    }
    return new Values.ErrorValue("Unknown operation " + this.operator);
  }
}
