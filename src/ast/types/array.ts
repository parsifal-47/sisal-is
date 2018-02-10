import { Expression } from "../expression";
import { TypeValue } from "./value";

export interface ArrayType extends TypeValue {
  elementType: Expression;
}

export function isArrayType(node: TypeValue): node is ArrayType {
  return node.name === "Array";
}
