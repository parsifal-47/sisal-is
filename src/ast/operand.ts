import { Node } from "./node";
import { Literal } from "./literal";
import { CompositeValue } from "./composite";
import { LetExpression } from "./let";
import { IfExpression } from "./if";
import { LoopExpression } from "./loop";

export type Operand = CompositeExpression | OldValue | CompositeValue | Literal | string;
export type CompositeExpression = LetExpression | LoopExpression | IfExpression;

export interface OldValue extends Node {
  id: string;
}

export function isOldValue(node: Node): node is OldValue {
  return node.type === "Old";
}
