export type Value = LiteralValue | StringValue | Node;

export enum LiteralType {
  Integer = "Integer",
  Float = "Float",
  Boolean = "Boolean",
}

export interface LiteralValue {
  type: LiteralType;
  value: number;
}

export interface StringValue {
  stringValue: string;
}
