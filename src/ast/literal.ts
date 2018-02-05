import { Node } from "./node";

export interface NumericLiteral extends Node {
  value: number;
}

export function isNumericLiteral(node: Node): node is NumericLiteral {
  return node.type === "NumericLiteral";
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

export type Literal = NumericLiteral | StringLiteral | BooleanLiteral;

export function isLiteral(node: Node): node is Literal {
  return isNumericLiteral(node) || isStringLiteral(node) || isBooleanLiteral(node);
}
