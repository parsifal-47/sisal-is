import { Expression } from "../expression";
import { TypeValue } from "./value";

export interface StreamType extends TypeValue {
  elementType: Expression;
}

export function isStreamType(node: TypeValue): node is StreamType {
  return node.name === "Stream";
}
