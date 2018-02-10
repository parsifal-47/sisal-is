import { CompositeValue } from "./composite";
import { IfExpression } from "./if";
import { LetExpression } from "./let";
import { Literal } from "./literal";
import { LoopExpression } from "./loop";
import { Node } from "./node";

export type Operand = CompositeExpression | OldValue | CompositeValue | Literal | string;
export type CompositeExpression = LetExpression | LoopExpression | IfExpression;

export interface OldValue extends Node {
  id: string;
}

export function isOldValue(node: Node): node is OldValue {
  return node.type === "Old";
}
