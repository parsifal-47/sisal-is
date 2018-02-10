import { Expression } from "./expression";
import { Node } from "./node";

export interface Definition extends Node {
  left: string[];
  right: Expression[];
}

export function isDefinition(node: Node): node is Definition {
  return node.type === "Definition";
}
