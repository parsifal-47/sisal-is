import { Expression } from "../expression";
import { TypeValue } from "./value";

export interface FunctionType extends TypeValue {
  params: Expression[];
  returns: Expression[];
}

export function isFunctionType(node: TypeValue): node is FunctionType {
  return node.name === "Function";
}
