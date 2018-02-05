import { TypeValue } from "./value";

export type PrimitiveType = IntegerType | BooleanType | FloatType | StringType;

export type IntegerType = TypeValue;

export function isIntegerType(node: TypeValue): node is IntegerType {
  return node.name === "integer";
}

export type BooleanType = TypeValue;

export function isBooleanType(node: TypeValue): node is BooleanType {
  return node.name === "boolean";
}

export type FloatType = TypeValue;

export function isFloatType(node: TypeValue): node is FloatType {
  return node.name === "float";
}

export type StringType = TypeValue;

export function isStringType(node: TypeValue): node is StringType {
  return node.name === "string";
}
