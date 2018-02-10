import { Definition } from "./definition";
import { Expression } from "./expression";
import { Node } from "./node";

export interface LetExpression extends Node {
  defintions: Definition[];
  expressions: Expression[];
}

export function isLetExpression(node: Node): node is LetExpression {
  return node.type === "Let";
}
