import { Node } from "./node";
import { Expression } from "./expression";

export interface IfExpression extends Node {
  condition: Expression;
  thenBranch: Expression[];
  elseBranch: Expression[];
  elseIfs: ElseIfBranch[];
}

export function isIfExpression(node: Node): node is IfExpression {
  return node.type === "If";
}

export interface ElseIfBranch extends Node {
  condition: Expression;
  branch: Expression[];
}

export function isElseIfBranch(node: Node): node is ElseIfBranch {
  return node.type === "ElseIf";
}
