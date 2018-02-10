import { StreamPort } from "./ports/stream"
import { Node } from "./node"
import * as Values from "./values";
import * as Types from "./types";
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
        throw new Error("Binary operand should produce exactly one output");
      }
      this.inPorts.push(node.outPorts[0]);
    }

    this.outPorts.push(new StreamPort(this.fetchData));
  }

  private fetchData(dataType: Types.ReadyType, offset: number): Values.ReadyValue {
    const left: ReadyValue = this.inPorts[0].getData(dataType, offset);
    const right: ReadyValue = this.inPorts[1].getData(dataType, offset);

    if (left.type !== right.type) {
      return new Values.ErrorValue("Types should be equal for binary operation");
    }

    return processPair(left, right);
  }

  private processPair(left: Values.ReadyValue, right: Values.ReadyValue): Values.ReadyValue {
    if ((left.type instanceof Types.Integer) &&
        (right.type instanceof Types.Integer)) {
          return this.processIntPair(left, right);
    }

    if ((left.type instanceof Types.Float) &&
        (right.type instanceof Types.Float)) {
          return this.processFloatPair(left, right);
    }

    if ((left.type instanceof Types.Boolean) &&
        (right.type instanceof Types.Boolean)) {
          return this.processBooelanPair(left, right);
    }

    if (left instanceof Types.StreamEnd) {
      return left;
    }

    if ((left instanceof Types.StreamElement) &&
        (right instanceof Types.StreamElement)) {
      return new Types.StreamElement(this.processPair(left.value, right.value));
    }

    return new Values.ErrorValue("Unsupported types " + left.type.name);
  }

  private processBooelanPair(left: Values.Boolean, right: Values.Boolean): Values.Boolean {
    if (this.operator === "|") {
      return new Values.Boolean(left.value || right.value);
    }
    if (this.operator === "&") {
      return new Values.Boolean(left.value && right.value);
    }
    if (this.operator === "^") {
      return new Values.Boolean(left.value ^ right.value);
    }
    if (this.operator === "||") {
      return new Values.Boolean(left.value || right.value);
    }
    return new Values.ErrorValue("Unknown operation " + this.operator);
  }

  private processIntPair(left: Values.Integer, right: Values.Integer): Values.Integer {
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
      return new Values.Boolean(left.value == right.value);
    }
    if (this.operator === "/=") {
      return new Values.Boolean(left.value != right.value);
    }
    return new Values.ErrorValue("Unknown operation " + this.operator);
  }

  private processFloatPair(left: Values.Float, right: Values.Float): Values.Float {
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
      return new Values.Boolean(left.value == right.value);
    }
    if (this.operator === "/=") {
      return new Values.Boolean(left.value != right.value);
    }
    return new Values.ErrorValue("Unknown operation " + this.operator);
  }
}
