import { Node } from "./node";

export type Expression = BinaryExpression | UnaryExpression | Postfix | Operand;

export interface BinaryExpression extends Node {
  operator: string;
  left: Expression;
  right: Expression;
}

export function isBinaryExpression(node: Node): node is BinaryExpression {
  return node.type === "Binary";
}

export interface UnaryExpression extends Node {
  operator: string;
  right: Expression;
}

export function isUnaryExpression(node: Node): node is UnaryExpression {
  return node.type === "Unary";
}

export interface Postfix extends Node {
  base: Operand;
  operationList: PostfixOperation[];
}

export function isPostfix(node: Node): node is Postfix {
  return node.type === "Postfix";
}

export type PostfixOperation = FunctionCall | RecordAccess | ArrayAccess;

export interface FunctionCall extends Node {
  arguments: Expression[];
}

export function isFunctionCall(node: Node): node is FunctionCall {
  return node.type === "FunctionCall";
}

export interface RecordAccess extends Node {
  field: string;
}

export function isRecordAccess(node: Node): node is RecordAccess {
  return node.type === "RecordAccess";
}

export interface ArrayAccess extends Node {
  index: Expression;
}

export function isArrayAccess(node: Node): node is ArrayAccess {
  return node.type === "ArrayAccess";
}
