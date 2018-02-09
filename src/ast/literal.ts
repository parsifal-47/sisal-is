import { Node } from "./node";

export interface IntegerLiteral extends Node {
  value: number;
}

export function isIntegerLiteral(node: Node): node is IntegerLiteral {
  return node.type === "IntegerLiteral";
}

export interface FloatLiteral extends Node {
  value: number;
}

export function isFloatLiteral(node: Node): node is FloatLiteral {
  return node.type === "FloatLiteral";
}

export interface BooleanLiteral extends Node {
  value: boolean;
}

export function isBooleanLiteral(node: Node): node is BooleanLiteral {
  return node.type === "BooleanLiteral";
}

export interface StringLiteral extends Node {
  value: string;
}

export function isStringLiteral(node: Node): node is StringLiteral {
  return node.type === "StringLiteral";
}

export type Literal = IntegerLiteral | FloatLiteral | StringLiteral | BooleanLiteral;

export function isLiteral(node: Node): node is Literal {
  return isIntegerLiteral(node) || isFloatLiteral(node) ||
         isStringLiteral(node) || isBooleanLiteral(node);
}
