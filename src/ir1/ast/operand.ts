import { Node } from "./node";
import { Literal } from "./literal";

export type Operand = CompositeExpression | OldValue | CompositeValue | Literal | string;
export type CompositeExpression = LetExpression | LoopExpression | IfExpression;

export interface OldValue extends Node {
  id: string;
}

export function isOldValue(node: Node): node is OldValue {
  return node.type === "Old";
}
