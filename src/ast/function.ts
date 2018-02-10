import { Definition } from "./definition";
import { Expression } from "./expression";
import { Node } from "./node";

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
  dataType?: Expression;
}

export function isIdWithOptionalType(node: Node): node is IdWithOptionalType {
  return node.type === "WeaklyTypedIdentifier";
}
