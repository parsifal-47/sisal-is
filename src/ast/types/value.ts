import { Node } from "./node";

export interface TypeValue extends Node {
  name: string;
}

export function isTypeValue(node: Node): node is TypeValue {
  return node.type === "Type";
}
