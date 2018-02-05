import { TypeValue } from "./value";
import { Expression } from "../expression";

export interface FunctionType extends TypeValue {
  params: Expression[];
  returns: Expression[];
}

export function isStreamType(node: TypeValue): node is FunctionType {
  return node.name === "Function";
}
