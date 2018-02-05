import { TypeValue } from "./value";
import { Expression } from "../expression";

export interface StreamType extends TypeValue {
  elementType: Expression;
}

export function isStreamType(node: TypeValue): node is StreamType {
  return node.name === "Stream";
}
