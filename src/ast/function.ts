import { Node } from "./node";
import { Definition } from "./definition";
import { Expression } from "./expression";

export interface FunctionValue extends Node {
  params: IdWithOptionalType[];
  body: Expression[];
  returns: Expression[];
}

export function isFunctionValue(node: Node): node is FunctionValue {
  return node.type === "Lambda";
}

export interface IdWithOptionalType extends Node {
  id: string;
  type?: Expression;
}

export function isIdWithOptionalType(node: Node): node is IdWithOptionalType {
  return node.type === "WeaklyTypedIdentifier";
}
