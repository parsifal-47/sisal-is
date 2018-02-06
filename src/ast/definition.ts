import { Node } from "./node";
import { Expression } from "./expression";

export interface Definition extends Node {
  left: string[];
  right: Expression[];
}

export function isDefinition(node: Node): node is Definition {
  return node.type === "Definition";
}
