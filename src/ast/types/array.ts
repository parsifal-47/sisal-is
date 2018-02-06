import { TypeValue } from "./value";
import { Expression } from "../expression";

export interface ArrayType extends TypeValue {
  elementType: Expression;
}

export function isArrayType(node: TypeValue): node is ArrayType {
  return node.name === "Array";
}
